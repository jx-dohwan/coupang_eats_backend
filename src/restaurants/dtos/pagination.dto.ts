import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

// GraphQL의 입력 타입을 정의합니다. 이 타입은 쿼리에서 사용자가 제공할 입력 데이터의 구조를 정의합니다.
@InputType()
export class PaginationInput {
    // Field 데코레이터를 사용하여 GraphQL 스키마에 등록할 필드를 정의합니다.
    // type => Int는 필드의 타입을 GraphQL의 Int(정수)로 지정합니다.
    // defaultValue: 1 옵션은 이 필드가 제공되지 않을 경우 기본값으로 1을 사용한다는 것을 의미합니다.
    @Field(type => Int, { defaultValue: 1 })
    page: number; // 사용자가 요청한 페이지 번호입니다.
}

// GraphQL의 출력 타입을 정의합니다. 이 타입은 쿼리의 결과로 클라이언트에게 전달되는 데이터의 구조를 정의합니다.
@ObjectType()
export class PaginationOutput extends CoreOutput {
    // 필드의 타입을 Int로 지정하고, nullable: true 옵션은 이 필드가 null일 수도 있음을 나타냅니다.
    // 즉, 총 페이지 수가 계산되지 않은 경우에 대비해 이 필드는 선택적으로 사용됩니다.
    @Field(type => Int, { nullable: true })
    totalPages?: number; // 쿼리 결과의 총 페이지 수입니다.

    // 쿼리 결과의 총 결과물 수입니다. 이 필드도 totalPages와 마찬가지로 선택적입니다.
    @Field(type => Int, { nullable: true })
    totalResults?: number;
}
