import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "./pagination.dto";
import { Restaurant } from "../entities/restaurant.entity";
import { Category } from "../entities/category.entity";

// PaginationInput을 확장하여 카테고리 조회 시 필요한 추가 입력 데이터를 정의하는 GraphQL 입력 타입입니다.
@InputType()
export class CategoryInput extends PaginationInput {
    // 카테고리를 식별할 수 있는 고유한 slug 문자열입니다.
    // @Field 데코레이터는 이 필드가 GraphQL 스키마에 포함될 것임을 나타내며, 문자열 타입임을 명시합니다.
    @Field(type => String)
    slug: string; // 사용자가 조회하고자 하는 카테고리의 slug입니다.
}


// PaginationOutput을 확장하여 카테고리 조회 결과를 나타내는 GraphQL 출력 타입입니다.
@ObjectType()
export class CategoryOutput extends PaginationOutput {
    // 해당 카테고리에 속하는 레스토랑 목록입니다.
    // 배열 타입으로 정의되며, nullable: true 옵션은 이 필드가 null일 수 있음을 나타냅니다.
    // 즉, 조회 결과 레스토랑이 없는 경우도 처리할 수 있습니다.
    @Field(type => [Restaurant], {nullable:true})
    restaurants?: Restaurant[];

    // 조회된 카테고리의 정보입니다. nullable: true로 설정되어 있어, 조회 결과에 따라 null이 될 수도 있습니다.
    // 예를 들어, 존재하지 않는 slug로 조회했을 때 이 필드는 null이 될 수 있습니다.
    @Field(type => Category, {nullable:true})
    category?: Category;
}
