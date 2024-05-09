import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { Dish } from "../entities/dish.entity";
import { CoreOutput } from "src/common/dtos/output.dto";

@InputType()
export class CreateDishInput extends PickType(Dish, [
    'name',
    'price',
    'description',
    'options',
    'photo',
    // PickType을 사용하여 Dish 엔티티에서 'name', 'price', 'description', 'options' 필드를 상속받아 입력 타입으로 사용
    // 이는 GraphQL에서 해당 요리를 생성할 때 필요한 필드들만 선택적으로 사용하기 위함
]) {
    @Field(type => Int)
    restaurantId: number; // restaurantId 필드를 GraphQL 스키마에 추가함 이 필드는 GraphQL 쿼리에서 입력 받을 값으로,
    // 타입은 Int(정수)입니다. 이 필드는 요리가 속할 식당의 고유 ID를 지정하는 데 사용
    // 사용자는 요리를 생성할 때 이 ID를 통해 해당 요리가 어느 식당에 속할지 결정할 수 있음
}

@ObjectType()
export class CreateDishOutput extends CoreOutput {
    // CoreOutput은 일반적으로 요청의 성공 여부와 에러 메시지(있을 경우)를 포함하는 표준 출력 객체
    // CreateDishOutput 클래스는 이 CoreOutput을 상속받아, 요리 생성 요청의 결과를 반환
    // 여기에 추가적인 필드가 필요하다면 추가할 수 있으며, 현재는 성공 실패 여부만 관리
}