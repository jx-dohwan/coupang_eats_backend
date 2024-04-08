import { MailService } from './mail.service';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { MailModuleOptions } from './mail.interfaces';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

// @Module 데코레이터는 이 클래스가 NestJS 모듈임을 나타냅니다.
// 여기서는 빈 객체를 전달하여 특별한 모듈 설정 없이 기본 모듈을 정의합니다.
@Module({})
// @Global 데코레이터는 이 모듈을 전역 모듈로 설정합니다.
// 전역 모듈은 애플리케이션 전체에서 한 번만 로드되며 다른 모듈에서도 사용할 수 있습니다.
@Global()
export class MailModule {
    // forRoot 정적 메소드는 MailModule의 구성을 위한 메소드입니다.
    // 이 메소드는 모듈 옵션을 인자로 받아, DynamicModule을 반환합니다.
    static forRoot(options: MailModuleOptions): DynamicModule {
        // DynamicModule 객체를 반환합니다. 이 객체는 모듈 설정을 정의합니다.
        return {
            // 현재 모듈을 지정합니다.
            module: MailModule,
            // providers 배열은 이 모듈에서 사용할 제공자(서비스 등)를 정의합니다.
            providers: [
                {
                    // CONFIG_OPTIONS 제공자를 통해 모듈 옵션을 제공합니다.
                    // 이 값은 MailService 내에서 의존성 주입을 통해 사용될 수 있습니다.
                    provide: CONFIG_OPTIONS,
                    useValue: options,
                },
                // MailService를 제공자로 추가합니다.
                // 이를 통해 MailService가 의존성 주입을 통해 사용될 수 있도록 합니다.
                MailService
            ],
            // exports 배열은 다른 모듈에서 사용할 수 있도록 이 모듈에서 내보낼 제공자를 정의합니다.
            // 여기서는 MailService를 내보냄으로써, 다른 모듈에서 MailService를 사용할 수 있습니다.
            exports: [MailService],
        }
    }
}
