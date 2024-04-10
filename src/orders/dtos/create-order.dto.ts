import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { OrderItemOption } from "../entities/order-item.entity";
import { CoreOutput } from "src/common/dtos/output.dto";

@InputType()  // GraphQL의 입력 타입으로 CreateOrderItemInput 클래스를 정의합니다.
class CreateOrderItemInput {
    @Field(type => Int)  // GraphQL 필드 정의, Integer 타입
    dishId: number;  // 주문할 요리의 ID

    @Field(type => [OrderItemOption], { nullable: true })  // OrderItemOption 배열 타입 필드, NULL 가능
    options?: OrderItemOption[];  // 주문 항목에 대한 추가 옵션 (예: 토핑, 사이드 등), 선택적 필드
}

@InputType()  // GraphQL의 입력 타입으로 CreateOrderInput 클래스를 정의합니다.
export class CreateOrderInput {
    @Field(type => Int)  // GraphQL 필드 정의, Integer 타입
    restaurantId: number; // 주문이 이루어질 식당의 ID

    @Field(type => [CreateOrderItemInput])  // CreateOrderItemInput 배열 타입 필드
    items: CreateOrderItemInput[];  // 주문 항목들의 배열
}

@ObjectType()  // GraphQL의 객체 타입으로 CreateOrderOutput 클래스를 정의합니다.
export class CreateOrderOutput extends CoreOutput {  // CoreOutput을 상속받아 공통 출력 필드(id, error, ok 등)를 포함합니다.
    @Field(type => Int, { nullable: true })  // GraphQL 필드 정의, Integer 타입, NULL 가능
    orderId?: number;  // 생성된 주문의 ID, 선택적 필드 (주문 생성 실패 시 NULL일 수 있음)
}