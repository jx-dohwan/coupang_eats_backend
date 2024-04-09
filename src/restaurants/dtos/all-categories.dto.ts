import { Field, ObjectType } from "@nestjs/graphql";
import { Category } from "../entities/category.entity";
import { CoreOutput } from "src/common/dtos/output.dto";

@ObjectType()
export class AllCategoriesOutput extends CoreOutput {
    // GraphQL 스키마에서 배열로 정의된 Category 타입의 필드입니다. nullable 옵션으로 인해 이 필드는 선택적입니다.
    @Field(type => [Category], { nullable: true })
    categories?: Category[];
}