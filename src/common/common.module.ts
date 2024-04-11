import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './common.constants';

// PubSub 인스턴스를 생성합니다. 이 인스턴스는 아래에서 NestJS의 DI 시스템에 의해 다른 컴포넌트에 주입될 수 있습니다.
const pubsub = new PubSub()


@Global() // 글로벌 모듈은 앱의 어느 곳에서나, 모듈을 명시적으로 import하지 않고도 서비스를 공유할 수 있습니다.
@Module({ // @Module 데코레이터는 클래스에 모듈의 메타데이터를 설정합니다.
    providers: [  // providers 배열은 Nest의 의존성 주입 컨테이너에 의해 인스턴스화되고 관리될 제공자들을 선언합니다.
        {
            provide: PUB_SUB,  // provide는 토큰을 지정합니다. 이 토큰을 통해 의존성 주입이 이루어집니다.
            useValue: pubsub,    // useValue는 고정된 값을 의존성 주입 컨테이너에 등록합니다. 여기서는 위에서 생성한 pubsub 객체가 사용됩니다.
        },
    ],
    // exports 배열은 이 모듈에서 제공하고 다른 모듈에서 사용할 수 있게 내보낼 제공자를 선언합니다.
    // PUB_SUB을 내보내면 다른 모듈에서도 이 토큰을 사용하여 PubSub 인스턴스에 접근할 수 있습니다.
    exports: [PUB_SUB]
})
// CommonModule 클래스를 선언하고 @Module 데코레이터를 통해 이 클래스가 모듈임을 명시합니다.
// 이 클래스는 NestJS에서 의존성 주입에 사용될 모듈의 설정을 포함합니다.
export class CommonModule { }