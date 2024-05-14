import { Inject, Injectable } from "@nestjs/common";
import { Order, OrderStatus } from "./entities/order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderItem } from "./entities/order-item.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { Dish } from "src/restaurants/entities/dish.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { User, UserRole } from "src/users/entities/user.entity";
import { GetOrdersInput, GetOrdersOutput } from "./dtos/get-orders.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dtos/edit-order.dto";
import { TakeOrderInput, TakeOrderOutput } from "./dtos/take-order.dto";
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from "src/common/common.constants";
import { PubSub } from "graphql-subscriptions";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orders: Repository<Order>,
        @InjectRepository(OrderItem) private readonly orderItems: Repository<OrderItem>,
        @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Dish) private readonly dishes: Repository<Dish>,
        @Inject(PUB_SUB) private readonly pubSub: PubSub

    ) { }

    async createOrder(
        customer: User,
        { restaurantId, items, totalCount }: CreateOrderInput,
    ): Promise<CreateOrderOutput> {
        try {
            // 식당 정보를 검색
            const restaurant = await this.restaurants.findOne({ where: { id: restaurantId } });
            if (!restaurant) {

                return {
                    ok: false,
                    error: '식당을 찾을 수 없습니다.',
                };
            }

            console.log("---------------------restaurant---------------------", restaurant)
            let orderFinalPrice = restaurant.deliveryFee; // 주문의 최종 가격 초기화
            const orderItems: OrderItem[] = []; // 주문에 포함될 주문 항목들을 저장할 배열 초기화

            // 주문 항목 처리
            for (const item of items) {
                // 음식 정보 조회
                const dish = await this.dishes.findOne({ where: { id: item.dishId } });
                if (!dish) {
                    return {
                        ok: false,
                        error: '해당 음식을 찾을 수 없습니다.',
                    };
                }

                let dishFinalPrice = dish.price*totalCount; // 음식의 기본 가격으로 시작(음식 가격 초기화)

                // 음식 가격 계산 : 주문 항목의 각 옵션에 대해 추가 가격을 계산 
                for (const itemOption of item.options) {
                    const dishOption = dish.options.find( // 해당 음식의 옵션 중, 주문 옵션과 일치하는 옵션을 찾는다.
                        dishOption => dishOption.name === itemOption.name,
                    );
                    if (dishOption) {
                        if (dishOption.extra) { // 추가가 있는 경우
                            dishFinalPrice = dishFinalPrice + dishOption.extra; 
                        } else { // 추가가 아닌 선택인 경우
                            const dishOptionChoice = dishOption.choices.find(
                                optionChoice => optionChoice.name === itemOption.choice,
                            );
                            if (dishOptionChoice) {
                                if (dishOptionChoice.extra) {
                                    dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                                }
                            }
                        }
                    }
                }

                orderFinalPrice = orderFinalPrice + dishFinalPrice; // 최종 주문 금액에 음식의 가격을 더한다.

                // 주문 항목 저장 : 생성된 주문 항목을 데이터 베이스에 저장
                const orderItem = await this.orderItems.save(
                    this.orderItems.create({
                        dish,
                        dishName: dish.name,
                        options: item.options, // 주문 옵션 포함
                    }),
                );
                orderItems.push(orderItem); // 저장된 주문 항목을 배열에 추가
            }

            // 주문 저장 : 생성된 주문 항목들과 함께 주문을 데이터베이스에 저장
            const order = await this.orders.save(
                this.orders.create({
                    customer,
                    restaurant,
                    totalCount:totalCount,
                    total: orderFinalPrice, // 최종금액
                    items: orderItems, // 주문 항목 
                }),
            );

            // 'await' 키워드를 사용하여 비동기 함수의 결과를 기다립니다. 이 경우, pubSub.publish() 메서드의 완료를 기다림
            // publish() 메서드는 지정된 이벤트에 대한 데이터를 발행하는 데 사용
            await this.pubSub.publish(
                // 첫 번째 인자 NEW_PENDING_ORDER는 발행할 이벤트의 이름
                // 이 이름을 구독하고 있는 모든 클라이언트는 이 이벤트가 발행될 때 통지를 받음
                NEW_PENDING_ORDER,
                {
                    // 두 번째 인자는 이 이벤트와 함께 전달할 데이터 객체
                    // 여기서는 pendingOrders 객체를 전달하고 있으며, 이 객체는 다음 두 가지 속성을 포함
                    pendingOrders: {
                        // order: 이벤트와 관련된 주문 객체. 이 주문의 상세 정보가 구독자에게 전달
                        order,
                        // ownerId: 주문을 소유한 레스토랑의 소유자 ID.
                        // 이 ID를 통해 특정 레스토랑 소유자만 이 이벤트를 수신하도록 필터링
                        ownerId: restaurant.ownerId
                    },
                }
            );


            return {
                ok: true,
                orderId: order.id,
            };

        } catch {
            return {
                ok: false,
                error: '해당 주문을 생성할 수 없습니다.',
            };
        }

    }

    async getOrders(
        user: User,
        { status }: GetOrdersInput,
    ): Promise<GetOrdersOutput> {
        try {
            let orders: Order[];
            if (user.role === UserRole.Client) {
                orders = await this.orders.find({
                    where: {
                        customer: { id: user.id },
                        ...(status && { status }),
                    },
                });
            } else if (user.role === UserRole.Delivery) {
                orders = await this.orders.find({
                    where: {
                        driver: { id: user.id },
                        ...(status && { status }),
                    },
                });
            } else if (user.role === UserRole.Owner) {
                const restaurants = await this.restaurants.find({
                    where: {
                        owner: { id: user.id },
                    },
                    relations: ['orders'],
                });

                orders = restaurants.map(restaurant => restaurant.orders).flat(1);

                if (status) {
                    orders = orders.filter(order => order.status === status);
                }
            }

            return {
                ok: true,
                orders,
            }

        } catch {
            return {
                ok: false,
                error: '주문을 받을 수 없습니다.'
            }
        }
    }

    canSeeOrder(user: User, order: Order): boolean {
        let canSee = true;
        if (user.role === UserRole.Client && order.customerId !== user.id) {
            canSee = false;
        }
        if (user.role === UserRole.Delivery && order.driverId !== user.id) {
            canSee = false;
        }
        if (user.role === UserRole.Owner && order.restaurant.ownerId !== user.id) {
            canSee = false;
        }
        return canSee;
    }

    async getOrder(
        user: User,
        { id: orderId }: GetOrderInput,
    ): Promise<GetOrderOutput> {
        try {
            const order = await this.orders.findOne({
                where: { id: orderId },
                relations: { restaurant: true },
            });

            if (!order) {
                return {
                    ok: false,
                    error: '주문을 찾을 수 없습니다.'
                };
            }

            return {
                ok: true,
                order,
            };

        } catch {
            return {
                ok: false,
                error: '주문을 로드할 수 없습니다.'
            }
        }
    }

    async editOrder(
        user: User,
        { id: orderId, status }: EditOrderInput,
    ): Promise<EditOrderOutput> {
        try {

            // 주문 Id를 기준으로 주문 정보 조회
            const order = await this.orders.findOne({
                where: {
                    id: orderId,
                }
            });

            // 주문이 존재하지 않는 경우 에러 반환
            if (!order) {
                return {
                    ok: false,
                    error: '주문을 찾을 수 없습니다.'
                };
            }

            // 사용자가 주문을 볼 권한이 있는지 확인
            if (!this.canSeeOrder(user, order)) {
                return {
                    ok: false,
                    error: '이것은 볼 수 없습니다.'
                };
            }

            let canEdit = true; // 주문 수정 권한 초기값 설정

            // 사용자의 역할에 따른 주문 상태 수정 권한 검사
            if (user.role === UserRole.Client) {
                canEdit = false; // 일반 고객은 주문 상태를 수정할 수 없음
            }

            if (user.role === UserRole.Owner) {
                // 식당 주인은 주문 상테를 Cooking 또는 Cooked로만 변경할 수 있음
                if (status !== OrderStatus.Cooking &&
                    status !== OrderStatus.Cooked) {
                    canEdit = false;
                }
            }

            if (user.role === UserRole.Delivery) {
                // 배달원은 주문 상태를 PickedUp 또는 Delivered로만 변경할 수 있음
                if (status !== OrderStatus.PickedUp &&
                    status !== OrderStatus.Delivered) {
                    canEdit = false;
                }
            }

            // 수정 권한이 없는 경우 에러를 반환함
            if (!canEdit) {
                return {
                    ok: false,
                    error: '권한이 없습니다.'
                };
            }

            // 주문 상태 업데이트
            await this.orders.save({
                id: orderId, // 주문 ID
                status, // 새로운 주문 상태
            });

            // 새로운 주문 객체를 생성 기존 주문 객체(order)에 새로운 상태(status)를 추가하여 구성
            const newOrder = { ...order, status };

            // 사용자의 역할을 확인 이 경우, 사용자가 오너일 때만 내부의 로직을 실행
            if (user.role === UserRole.Owner) {
                // 주문의 상태가 'Cooked'인 경우에만 아래 로직을 실행
                if (status === OrderStatus.Cooked) {
                    // 'await' 키워드는 이 비동기 함수(pubSub.publish)의 완료를 기다림
                    // 'NEW_COOKED_ORDER' 이벤트를 발행 이 이벤트는 주문이 조리 완료된 경우에 발행
                    await this.pubSub.publish(NEW_COOKED_ORDER, {
                        // 이 이벤트와 함께 'cookedOrders'라는 키로 newOrder 객체를 데이터로 전달
                        // 구독자는 이 데이터를 사용하여 조리 완료된 주문을 처리
                        cookedOrders: newOrder,
                    });
                }
            }

            // 'NEW_ORDER_UPDATE' 이벤트를 발행. 이 이벤트는 주문 상태 업데이트를 모든 관련 클라이언트에 알림
            await this.pubSub.publish(NEW_ORDER_UPDATE, {
                // 'orderUpdates'라는 키로 newOrder 객체를 전달
                // 이 객체는 최신 주문 상태를 포함하고 있으며, 구독자는 이 정보를 사용하여 주문 상태 변경을 반영
                orderUpdates: newOrder
            });

            return {
                ok: true,
            }


        } catch {
            return {
                ok: false,
                error: '주문을 수정할 수 없습니다.'
            }
        }
    }

    async takeOrder(
        driver: User,
        { id: orderId }: TakeOrderInput,
    ): Promise<TakeOrderOutput> {
        try {
            const order = await this.orders.findOne({ where: { id: orderId } });

            if (!order) {
                return {
                    ok: false,
                    error: '주문을 찾을 수 없습니다.',
                };
            }

            if (order.driver) {
                return {
                    ok: false,
                    error: '이미 배달중입니다.'
                };
            }

            await this.orders.save({
                id: orderId,
                driver,
            });

            // 'await' 키워드를 사용하여 비동기 함수인 pubSub.publish()의 완료를 기다림
            // 이 함수는 주어진 이벤트를 발행하는 역할을 하며, 이 경우 'NEW_ORDER_UPDATE' 이벤트를 발행
            await this.pubSub.publish(
                // 첫 번째 인자, NEW_ORDER_UPDATE는 발행할 이벤트의 이름
                // 이 이벤트 이름을 구독하고 있는 클라이언트들은 이 이벤트가 발행될 때 알림을 받게 됨
                NEW_ORDER_UPDATE, {
                // 두 번째 인자는 이 이벤트와 함께 전달할 데이터 객체
                orderUpdates: {
                    // spread 연산자(...)를 사용하여 기존의 order 객체를 복사
                    // 이렇게 하면 order 객체의 모든 기존 필드와 값들이 새 객체에 포함
                    ...order,

                    // driver 객체를 직접 추가. 이 객체는 주문을 처리할 운전자의 정보를 포함
                    driver,

                    // driverId 필드를 추가하고, driver 객체의 id 속성을 이 필드의 값으로 설정
                    // 이는 데이터를 명시적으로 구조화하여, 이벤트를 수신하는 측에서 운전자 ID를 쉽게 참조할 수 있게 함
                    driverId: driver.id
                },
            }
            );

            return {
                ok: true,
            };

        } catch {
            return {
                ok: false,
                error: '주문을 업데이트할 수 없습니다.'
            }
        }
    }

}