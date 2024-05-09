// 필요한 NestJS GraphQL 데코레이터와 타입을 불러옵니다.
import { Field, InputType, Int, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { Dish } from "../entities/dish.entity";  // Dish 엔티티를 가져옵니다.
import { CoreOutput } from "src/common/dtos/output.dto";  // 공통 출력 DTO를 가져옵니다.

// GraphQL의 InputType으로 EditDishInput을 정의합니다. 이는 GraphQL 스키마에서 입력 타입으로 사용됩니다.
@InputType()
export class EditDishInput extends PickType(
    PartialType(Dish),  // Dish 엔티티의 일부 필드를 선택적 필드로 만듭니다 (PartialType 사용).
    [
        'name',         // Dish 엔티티에서 'name' 필드를 포함합니다.
        'options',      // 'options' 필드를 포함합니다.
        'price',        // 'price' 필드를 포함합니다.
        'description',  // 'description' 필드를 포함합니다.
        'photo',

    ]  // PickType은 주어진 배열의 필드만을 포함하는 새 타입을 만듭니다.
) {
    @Field(type => Int)  // dishId 필드는 GraphQL 스키마에서 Int 타입으로 정의됩니다.
    dishId: number;      // 식별자로 사용될 dishId 필드를 정의합니다.
}

// GraphQL의 ObjectType으로 EditDishOutput을 정의합니다. 이는 GraphQL 스키마에서 출력 타입으로 사용됩니다.
@ObjectType()
export class EditDishOutput extends CoreOutput { }  // CoreOutput을 확장하여 기본적인 출력(성공 여부, 에러 메시지 등)을 포함합니다.
