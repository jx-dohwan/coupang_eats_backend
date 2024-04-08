import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

// AuthUser라는 커스텀 파라미터 데코레이터를 생성한다.
export const AuthUser = createParamDecorator(
    // 이 함수는 실제로 데코레이터의 로직을 구현한다.
    (data:unknown, context: ExecutionContext) => { 
        // GraphQL 실행 컨텍스트를 기반으로 하는 NestJS 실행 컨텍스트를 생성한다.
        // 이렇게 함으로써, GraphQL 환경에서 작동하는 NestJS 애플리케이션에서 표준 NestJS 실행 컨텍스트를 사용할 수 있다.
        const gqlContext = GqlExecutionContext.create(context).getContext();

        // gqlContext에서 'user' 키를 통해 사용자 정보를 가져온다.
        // 이 'user'객체는 보통 인증 과정에서 GraphQL 컨텍스트에 추가된다.
        const user = gqlContext['user'];

        // 최종적으로 이 함수는 gqlContext에서 추출한 사용자 정보를 반환한다.
        // 이렇게 반환된 사용자 정보는 @AuthUser 데코레이터를 사용하는 핸들러의 파라미터로 주입된다.
        return user;
    }
)