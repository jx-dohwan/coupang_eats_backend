import { Args, Mutation, Resolver, Query, Subscription } from "@nestjs/graphql";
import { Order } from "./entities/order.entity";
import { OrderService } from "./orders.service";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { User } from "src/users/entities/user.entity";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
import { GetOrdersInput, GetOrdersOutput } from "./dtos/get-orders.dto";
import { GetOrderInput, GetOrderOutput } from "./dtos/get-order.dto";
import { EditOrderInput, EditOrderOutput } from "./dtos/edit-order.dto";
import { TakeOrderInput, TakeOrderOutput } from "./dtos/take-order.dto";
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER, PUB_SUB } from "src/common/common.constants";
import { PubSub } from "graphql-subscriptions";
import { Inject } from "@nestjs/common";
import { OrderUpdatesInput } from "./dtos/order-updates.dto";

@Resolver(of => Order)
export class OrderResolver {
    constructor(
        private readonly ordersService: OrderService,
        @Inject(PUB_SUB) private readonly pubSub: PubSub
    ) { }

    @Mutation(returns => CreateOrderOutput)
    @Role(['Client'])
    async createOrder(
        @AuthUser() customer: User,
        @Args('input') createOrderInput: CreateOrderInput,
    ): Promise<CreateOrderOutput> {
        return this.ordersService.createOrder(customer, createOrderInput)
    }

    @Query(returns => GetOrdersOutput)
    @Role(['Any'])
    async getOrders(
        @AuthUser() user: User,
        @Args('input') getOrdersInput: GetOrdersInput,
    ): Promise<GetOrdersOutput> {
        return this.ordersService.getOrders(user, getOrdersInput)
    }

    @Query(returns => GetOrderOutput)
    @Role(['Any'])
    async getOrder(
        @AuthUser() user: User,
        @Args('input') getOrderInput: GetOrderInput,
    ): Promise<GetOrderOutput> {
        return this.ordersService.getOrder(user, getOrderInput);
    }

    @Mutation(returns => EditOrderOutput)
    @Role(['Any'])
    async editOrder(
        @AuthUser() user: User,
        @Args('input') editOrderInput: EditOrderInput,
    ): Promise<EditOrderOutput> {
        return this.ordersService.editOrder(user, editOrderInput);
    }

    // Subscription
    @Subscription(returns => Order, { // 반환 타입으로 Order를 명시하여, 이 구독이 Order 객체를 반환할 것임을 나타냄
        filter: ({ pendingOrders: { ownerId } }, _, { user }) => { // filter 함수를 정의하여, 발행된 이벤트 중 구독자에게 전송할 이벤트를 필터링 한다.
            return ownerId === user.id; // ownerId가 현재 로그인한 사용자의 ID와 동일할 때만 이벤트를 구독자에게 전달
        },
        resolve: ({ pendingOrders: { order } }) => order, // resolve 함수를 사용하여, 이벤트 데이터 중에서 실제로 클라이언트에 반환할 데이터를 정의
    })

    @Role(['Owner']) // Owner 역할을 가진 사용자만 접근할 수 있도록
    pendingOrders() {
        // NEW_PENDING_ORDER 이벤트를 기반으로 비동기 이터레이터를 생성하고 반환
        // 이터레이터는 이벤트가 발행될 때마다 Order 객체를 발생
        return this.pubSub.asyncIterator(NEW_PENDING_ORDER);
    }

    @Subscription(returns => Order) // 조리 완료된 주문들을 위한 구독이다.
    @Role(['Delivery']) // Delevery 역할을 가진 사용자만 접근 가능하다.
    cookedOrders() {
        return this.pubSub.asyncIterator(NEW_COOKED_ORDER); // NEW_COOKED_ORDER 이벤트를 기반으로 비동기 이터레이터를 생성하여 반환
    }

    @Subscription(returns => Order, { // 주문 업데이트를 위한 Subscription을 정의
        filter: (
            { orderUpdates: order }: { orderUpdates: Order },
            { input }: { input: OrderUpdatesInput },
            { user }: { user: User },
        ) => { // 필터에서는 드라이버, 고객, 레스토랑 오너 중 현재 로그인한 사용자가 관련된 주문만을 받도록 체크
            if (
                order.driverId !== user.id &&
                order.customerId !== user.id &&
                order.restaurant.ownerId !== user.id
            ) {
                return false;
            }
            return order.id === input.id; // 추가적으로, input으로 전달된 주문 ID와 이벤트 데이터의 주문 ID가 일치하는 경우에만 true를 반환
        },
    })
    
    @Role(['Any']) // 'Any' 역할을 가진 사용자가 접근 가능하도록 설정
    orderUpdates(@Args('input') orderUpdatesInput: OrderUpdatesInput) {
        return this.pubSub.asyncIterator(NEW_ORDER_UPDATE); // NEW_ORDER_UPDATE 이벤트를 기반으로 비동기 이터레이터를 생성하여 반환합니다.
    }

    @Mutation(returns => TakeOrderOutput) // 주문 수락을 위한 Mutation을 정의
    @Role(['Delivery']) // 이 뮤테이션은 'Delivery' 역할을 가진 사용자만 수행
    takeOrder(
        @AuthUser() driver: User, // 현재 인증된 사용자(배달기사)를 AuthUser 데코레이터를 통해 가져옴 
        @Args('input') takeOrderInput: TakeOrderInput, // 클라이언트에서 제공한 입력 값을 가져옴
    ): Promise<TakeOrderOutput> { 
        return this.ordersService.takeOrder(driver, takeOrderInput);  // ordersService의 takeOrder 함수를 호출하여 주문을 수락하고 결과를 반환
    }
}