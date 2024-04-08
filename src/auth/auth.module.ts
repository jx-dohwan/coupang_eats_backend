import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './auth.guard';

// @Module 데코레이터는 이 클래스를 NestJS 모듈로 정의합니다.
@Module({
    // imports 배열은 이 모듈이 의존하는 다른 모듈들을 나열합니다.
    // 여기서는 사용자 관련 기능을 담당하는 UsersModule을 임포트하고 있습니다.
    imports: [UsersModule],
    // providers 배열은 이 모듈에서 사용할 제공자들을 나열합니다.
    providers: [
        {
            // provide에 APP_GUARD를 사용함으로써, 애플리케이션 수준에서 동작하는 가드를 설정합니다.
            // 이 가드는 애플리케이션의 모든 요청에 대해 동작하게 됩니다.
            provide: APP_GUARD,
            // useClass에 AuthGuard를 지정하여, 모든 요청에 대해 AuthGuard를 사용하도록 합니다.
            // AuthGuard는 요청이 처리되기 전에 사용자의 인증 상태를 검사하는 역할을 합니다.
            useClass: AuthGuard,
        },
    ],
})
export class AuthModule { }