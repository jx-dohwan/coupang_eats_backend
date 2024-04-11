import { Field, Float, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, RelationId } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { IsEnum, IsNumber } from "class-validator";


export enum OrderStatus {
    Pending = 'Pending',
    Cooking = 'Cooking',
    Cooked = 'Cooked',
    PickedUp = 'PickedUp',
    Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
    @Field(type => User, { nullable: true })  // GraphQL 스키마에서의 필드 정의, User 타입, null 허용
    @ManyToOne(
        type => User,  // "One" 측: User 엔티티 타입. 이 관계에서 User는 "One" 측입니다 (주문과 연관된 고객).
        user => user.orders,  // "Many" 측 연결: User 엔티티의 orders 속성을 통해 연결됨.
        // 이는 User 엔티티가 여러 Order 엔티티를 포함할 수 있음을 의미합니다.
        { onDelete: 'SET NULL', nullable: true, eager: true },  // 설정: User 삭제 시 Order의 customer 필드를 NULL로 설정
    )
    customer?: User;  // customer 필드는 Order 엔티티와 관련된 User 엔티티를 참조합니다. 선택적 필드 (null 가능).

    @RelationId((order: Order) => order.customer)  // RelationId 데코레이터: Order 엔티티의 customer 필드에 저장된 User의 ID를 customerId 필드에 자동으로 저장합니다.
    customerId: number;  // customerId 필드: 이는 customer 필드에서 참조하는 User 엔티티의 ID 값을 저장합니다.

    @Field(type => User, { nullable: true })  // GraphQL 스키마에서의 필드 정의, User 타입, null 허용 (주문과 연관된 운전자).
    @ManyToOne(
        type => User,  // "One" 측: User 엔티티 타입. 이 관계에서도 User는 "One" 측입니다 (주문과 연관된 운전자).
        user => user.rides,  // "Many" 측 연결: User 엔티티의 rides 속성을 통해 연결됨.
        // 이는 User 엔티티가 여러 Order 엔티티를 포함할 수 있음을 의미합니다 (여기서는 'rides'라고 표현).
        { onDelete: 'SET NULL', nullable: true, eager: true },  // 설정: User 삭제 시 Order의 driver 필드를 NULL로 설정
    )
    driver?: User;  // driver 필드는 Order 엔티티와 관련된 User 엔티티를 참조합니다. 선택적 필드 (null 가능).

    @RelationId((order: Order) => order.driver)  // RelationId 데코레이터: Order 엔티티의 driver 필드에 저장된 User의 ID를 driverId 필드에 자동으로 저장합니다.
    driverId: number;  // driverId 필드: 이는 driver 필드에서 참조하는 User 엔티티의 ID 값을 저장합니다.

    @Field(type => Restaurant, { nullable: true })  // GraphQL 스키마에서의 필드 정의, Restaurant 타입, null 허용
    @ManyToOne(
        type => Restaurant,                         // "One" 측: Restaurant 엔티티 타입
        restaurant => restaurant.orders,            // "Many" 측 연결: Restaurant 엔티티의 orders 속성을 통해 연결됨
        { onDelete: 'SET NULL', nullable: true, eager: true },  // 설정: Restaurant 삭제 시 Order의 restaurant 필드를 NULL로 설정
    )
    restaurant?: Restaurant;  // restaurant 필드는 Order 엔티티와 관련된 Restaurant 엔티티를 참조합니다. 선택적 필드 (null 가능).

    @Field(type => [OrderItem])  // OrderItem 배열 타입 필드
    @ManyToMany(type => OrderItem, { eager: true })  // ManyToMany 관계, OrderItem 엔티티와
    // many to many이기 때문에 join을 해줘야 한다.
    // JoinTable 데코레이터: 현재 엔티티(Order)와 ManyToMany 관계에 있는 엔티티(OrderItem)를 연결하는 테이블 생성
    // 소유하고 있는 쪽의 relation에 추가하면 된다. 
    @JoinTable()
    items: OrderItem[];  // items 필드는 여러 OrderItem 엔티티를 배열로 가집니다.

    @Column({ nullable: true })  // 데이터베이스 컬럼 설정: NULL 허용
    @Field(type => Float, { nullable: true })  // GraphQL 필드, Float 타입, null 허용
    @IsNumber()  // class-validator: 이 필드는 숫자여야 함을 검증
    total?: number;  // total 필드는 주문의 총액을 나타냅니다. 선택적 필드 (null 가능).

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })  // enum 타입 컬럼, 기본값은 OrderStatus.Pending
    @Field(type => OrderStatus)  // GraphQL 필드, OrderStatus enum 타입
    @IsEnum(OrderStatus)  // class-validator: 이 필드의 값은 OrderStatus 열거 타입에 정의된 값들 중 하나여야 함을 검증
    status: OrderStatus;  // status 필드는 주문의 상태를 나타냅니다. 기본값은 'Pending'.
}