import { JwtModuleOptions } from './interfaces/jwt-module-options.interface';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from './jwt.service';

@Module({})
@Global() // 이 모듈을 글로벌 모듈로 설정한다. 글로벌 모듈은 애플리케이션 어느 곳에서나 즉시 사용할 수 있다.
export class JwtModule {
    // forRoot 정적 메서드는 이 모듈을 동적으로 구성하기 위해 호출된다. JwtModuleOptions 타입의 옵션 객체를 매개변수로 받는다.
    static forRoot(options: JwtModuleOptions): DynamicModule {
        return {
            module: JwtModule, // 현재 모듈을 지정한다.
            providers: [  // 이 모듈에서 사용할 프로바이더(서비스)를 정의한다.
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options, // 실제 설정 값은 인자로 받은 options객체를 사용한다.
                },
                JwtService, // 이 모듈이 제공하는 기능을 담당하는 섭시ㅡ이다.
            ],
            exports: [JwtService],
        }
    }
}
