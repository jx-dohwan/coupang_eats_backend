import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { Verification } from './entities/verification.entity';

@Module({
     // imports 배열은 이 모듈이 의존하는 다른 모듈을 명시합니다.
    // TypeOrmModule.forFeature 메서드를 사용하여, User와 Verification 엔티티를 현재 모듈의 TypeORM 스코프에 등록합니다.
    imports: [TypeOrmModule.forFeature([User, Verification])],
    providers: [UsersResolver, UsersService], // 이 모듈에서 인스턴스화되어야 하는 제공자를 정
    exports: [UsersService] // 이 모듈이 다른 모듈에 제공하는 제공자를 정의

})
export class UsersModule { }
