import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Dish } from "src/restaurants/entities/dish.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@InputType('OrderItemOptionInputType', { isAbstract: true })  // GraphQL의 입력 타입으로 OrderItemOption을 정의합니다. 이 타입은 추상적입니다.
@ObjectType()  // GraphQL의 객체 타입으로도 OrderItemOption을 정의합니다.
export class OrderItemOption {
    @Field(type => String)  // GraphQL 스키마에서의 필드 정의, String 타입
    name: string;  // 옵션의 이름

    @Field(type => String, { nullable: true })  // nullable: true를 통해 choice 필드가 NULL이 될 수 있음을 명시
    choice: string;  // 옵션에 대한 선택 (예: 피자 사이즈에서 "Large")
}

@InputType('OrderItemInputType', { isAbstract: true })  // OrderItem을 위한 GraphQL 입력 타입, 추상적으로 정의
@ObjectType()  // OrderItem을 위한 GraphQL 객체 타입
@Entity()  // TypeORM을 사용하여 데이터베이스 테이블로 매핑
export class OrderItem extends CoreEntity {  // CoreEntity를 상속받아 공통 필드(id, createdAt, updatedAt 등)를 포함
    @Field(type => Dish)  // GraphQL 필드, Dish 타입
    @ManyToOne(type => Dish, { nullable: true, onDelete: 'CASCADE' })  // ManyToOne 관계, Dish가 삭제되면 연결된 OrderItem도 삭제
    dish: Dish;  // Dish 엔티티와 연결된 필드

    @Field(type => [OrderItemOption], { nullable: true })  // OrderItemOption 배열 타입 필드, NULL 가능
    @Column({ type: 'json', nullable: true })  // TypeORM에서 json 타입 컬럼으로 정의, NULL 허용
    options?: OrderItemOption[];  // 주문 항목에 대한 옵션 배열, 선택적 필드
}