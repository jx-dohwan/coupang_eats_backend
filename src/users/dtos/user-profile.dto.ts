import { ArgsType, Field, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { User } from "../entities/user.entity";

@ArgsType() // 해당 데코레이터를 사용하여 GraphQL 쿼리나 뮤테이션에서 사용할 인자의 타입을 정의
export class UserProfileInput {
    @Field(type => Number) // GraphQL 필드를 정의
    userId: number 
}

@ObjectType() // 해당 데코레이터를 사용하여 GraphQL 객체타입을 정의
export class UserProfileOutput extends CoreOutput {
    @Field(type => User, { nullable: true })
    user?: User;
}