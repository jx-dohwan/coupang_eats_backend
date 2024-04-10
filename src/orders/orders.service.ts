import { Injectable } from "@nestjs/common";
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

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private readonly orders: Repository<Order>,
        @InjectRepository(OrderItem) private readonly orderItems: Repository<OrderItem>,
        @InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Dish) private readonly dishes: Repository<Dish>,

    ) { }

    async createOrder(
        customer: User,
        { restaurantId, items }: CreateOrderInput,
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
            let orderFinalPrice = 0; // 주문의 최종 가격 초기화
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

                let dishFinalPrice = dish.price; // 음식의 기본 가격으로 시작(음식 가격 초기화)

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

                // 주문 항목 저장 : 생성된 주문 항목을 데이터 베이스에 저장한다.
                const orderItem = await this.orderItems.save(
                    this.orderItems.create({
                        dish,
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
                    total: orderFinalPrice, // 최종금액
                    items: orderItems, // 주문 항목 
                }),
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
}