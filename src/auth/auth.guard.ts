import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector, // 메타데이터를 조회하는 데 사용된다.
        private readonly jwtService: JwtService, // 토큰을 검증하는 데 사용된다.
        private readonly userService: UsersService, // 사용자 정보를 조회하는 데 사용된다. 
    ) { }

    async canActivate(context: ExecutionContext) { // 현재 요청이 주어진 조건을 만족하는지 검사한다.
        const roles = this.reflector.get<AllowedRoles>( // 메타데이터를 현재 핸들러에서 조회한다.
            'roles',
            context.getHandler(),
        );
        if (!roles) { // 메타데이터가 없으면 모든 사용자가 접근할 수 있다.
            return true;
        }
        const gqlContext = GqlExecutionContext.create(context).getContext(); // graphQL 실행 컨텍스트를 가져온다.
        const token = gqlContext.token; // 요청 헤더에서 토큰을 가져온다.
        if (token) {// 토큰이 존재한다면 검증한다. 
            const decoded = this.jwtService.verify(token.toString());
            if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) { // 토큰이 유효하면 사용자 정보를 조회한다.
                const { user } = await this.userService.findById(decoded['id']); 
                if (user) {
                    gqlContext['user'] = user; // 조회된 사용자 정보를 graphQL 컨텍스트에 저장한다.
                    if (roles.includes('Any')) { // 'Any'역할이면 모든 사용자가 접근할 수 있다.
                        return true;
                    }
                    return roles.includes(user.role); // 사용자의 역할이 허용된 역할 목록에 포함되어 있는지 확인한다. 
                }
            }
        }
        // 위 조건을 만족하지 못하면 접근을 거부한다.
        return false;
    }
}
