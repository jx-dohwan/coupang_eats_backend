import { JwtModuleOptions } from './interfaces/jwt-module-options.interface';
import { Inject, Injectable } from "@nestjs/common";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import * as jwt from "jsonwebtoken";

@Injectable() // 해당 클래스가 서비스로서 NestJS의 의존성 주입 시스템에 의해 관리될 수 있음을 나타냄
export class JwtService {
    constructor( // 클래스 생성자로, NestJS의 의존성 주입을 통해 JwtModuleOptions 타입의 설정 옵션을 주입받는다. 
        @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions, // @Inject데코레이터를 사용하여 CONFIG_OPTIONS 식별자와 연결된 값을 options 프로퍼티로 주입한다.
    ) { }
    sign(userId: number): string { // 사용자의 ID를 받아서 새로운 JWT를 생성한다.
        // jwt.sign 함수를 사용하여 토큰을 생성한다. 첫번째 인자는 토큰의 payload로, 여기서는 사용자의 ID를 객체 형태로 전달한다.
        // 두번째 인자는 서명에 사용될 비밀키이다. 이 값은 JwtService에 주입된 설정에서 PrivateKey를 통해 가져온다.
        return jwt.sign({ id: userId }, this.options.privateKey);
    }
    verify(token: string) { // 제공된 JWT를 검증한다.
        // jwt.verify 함수를 사용하여 토큰을 검증한다. 첫 번째 인자는 검증할 토큰이며, 두번째 인자는 서명에 사용된 비밀 키이다. 
        // 이 메서드는 토큰이 유효한 경우 토큰의 payload를 반환하고, 그렇지 않으면 오류를 발생시킨다.
        return jwt.verify(token, this.options.privateKey);
    }
}