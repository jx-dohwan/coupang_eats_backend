import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { CreateRestaurantInput } from "./create-restaurant.dto";
import { CoreOutput } from "src/common/dtos/output.dto";

@InputType() // GraphQL 스키마에서 입력 타입을 정의할 때 사용된다. 이 타입은 클라이언트가 서버로 데이터를 전송할 때 사용되는 구조를 설명
// 기존 타입의 모든 필드를 선택적 필드로 변환 여기서는 CreateRestaurantInput 타입의 필드를 기반으로 하되, 
// 모든 필드가 필수가 아닌 선택적으로 변경되어, 편집시 일부 정보만 업데이트 할 수 있다.
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) { 
    @Field(type => Number) // GraphQL 필드를 정의
    restaurantId: number;

}

@ObjectType() // GraphQL 스키마에서 출력 타입을 정의할 때 상요된다. 이 타입은 서버가 클라이언트로 데이터를 전송할 때 사용되는 구조를 설명한다.
export class EditRestaurantOutput extends CoreOutput { }