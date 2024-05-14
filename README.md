## 💡프로젝트 소개

```
1️⃣ 주제 : 쿠팡이츠 클론코딩 백엔드
2️⃣ 목표 : 쿠팡이츠와 유사한 프로젝트를 완성
3️⃣ 설명 : TypeScript, Nest.js, GraphQL, TypeORM을을 활용하여 프로젝트 진행
```

### 해당 프로젝트에 관한 자세한 설명은 블로그에 정리<br>
- [쿠팡이츠 클론코딩 프론트엔드](https://velog.io/@jx7789/series/%EC%BF%A0%ED%8C%A1%EC%9D%B4%EC%B8%A0-%ED%81%B4%EB%A1%A0%EC%BD%94%EB%94%A9ft.%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C)]<br>
- [쿠팡이츠 클론코딩 백엔드](https://velog.io/@jx7789/series/%EC%BF%A0%ED%8C%A1%EC%9D%B4%EC%B8%A0-%ED%81%B4%EB%A1%A0%EC%BD%94%EB%94%A9-%EB%B0%B1%EC%97%94%EB%93%9C)<br>

## Backend Setup
### 1. application 설치와 git연동
```
nest g application
```
1. 위의 명령어를 입력하면 project명을 입력하라고 나온다. 나는 여기에서 coupang_eats_backend로 만들 것이다. 그 다음 해당 위치로 가서 `npm i`를 하여 pacage.json의 내용을 install해준다.
```
npm i
```
2. git에 레퍼지토리를 만들고 git에서 제공하는 방식대로 git init과 git branch -M main 그리고 git remote add origin을 해준다.
3. 그리고 git에 무엇을 업로드 하지 말아야 할지 정해주는 `.gitignore`를 설정해준다. 이는 extends에서 gitignore를 설치해주고 명령 팔레트에서 `add gitignore`를 누르고 node를 입력하여 클린한다. 그러면 자동으로 node에 필요한 gitignore가 설치되었을 것이다.
4.  다음으로는 git add .로 모두 git에 추가하고 git commit -M "First commit"를 해준다. 그리고 git push origin main을 해주면 github에 해당 코드가 올라가 있는 것을 확인할 수 있다.

### 2. GraphQL : Apollo Server 셋팅

```
npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql
```
NestJS 프로젝트에서 GraphQL API를 구축하기 위한 기본적인 도구를 제공한다.
- `@nestjs/graphql`:NestJS 프레임워크와 GraphQL 사이의 통합을 가능하게 하는 모듈이다. 이를 통해 GraphQL 서버를 쉡게 구성하고, GraphQL 스키마를 정의할 수 있다.
- `@nestjs/apollo`:Apollo Server는 가장 인기 있는 GraphQL 서버 중 하나이다. `@nestjs/apollo`는 NestJS에서 Apollo Server를 사용할 수 있도록 하는 패키지이다
- `@apollo/server`:Apollo Server의 코어 라이브러리로, GraphQL API 서버를 구축하는 데 필요한 기능들을 제공한다.
- `graphql` : GraphQL 쿼리 언어의 자바스크립트 구현이다. Apollo Server와 함께 사용하여 API의 스키마와 resolver를 정의한다.


### 3. class validator 및 transformer 설치
```
npm i class-validator
```

```
npm i class-transformer
```

이 두 라이브러리는 데이터의 검증과 변환을 위해서 사용된다. 이들은 NestJS에서 매우 유용하게 사용될 수 있으며, DTO(Data Transfor Object)패턴과 함께 사용될때 더욱 강력하다
- `class-validator` : 이 라이브러리를 사용하여 클래스 인스턴스의 속성에 대한 유효성 검사 규칙을 선언적으로 정의할 수 있다. 예를 들어, 이메일이 유효한 형식인지, 문자열의 길이가 특정 범위 내에 있는지 등을 검사할 수 있다. 이를 통해 클라이언트로부터 받은 데이터가 비즈니스 로직을 처리하기 전에 올바른 형태인지를 검증할 수 있다.
- `class-transformer` : 이 라이브러리는 인스턴스를 다른 클래스의 인스턴스로 변환하거나, 일반 자바스크립트 객체를 클래스의 인스턴스로 변환하는 등의 작업을 할 수 있게 해준다. 이는 데이터를 적절한 형태로 변환하고, 타입 안정성을 유지하며 작업할 수 있게 해준다.

### 4. Postgresql 설치 
Postgresql 및 pgAdmin을 설치한다. 
- [PostgreSQL 설치](https://www.postgresql.org/download/)
- [pgAdmin4 설치](https://www.pgadmin.org/download/)

### 5. TypeORM 설치
```
npm install --save @nestjs/typeorm typeorm pg
```
typeORM은 TypeScript와 JavaSCript를 위한 ORM(Object-Relational Mapping)라이브러리이다. 데이터베이스와 객체지향 프로그래밍 언어 사이의 호환성을 제공함으로써, 개발자가 복잡한 SQL 쿼리 없이 데이터베이스를 보다 쉽게 다룰 수 잇게 해준다. TypeORM은 SQL 데이터베이스와 함께 작동하도록 설게되었으며, 매우 유연하고 확장 가능한 구조를 가지고 있다.
- `@nestjs/typeorm` : 이 패키지는 TypeORM을 NestJS와 통합하기 위한 모듈이다. NestJS의 의존성 주입 시스템과 함께 작동하여, TypeORM 레포지토리를 서비스에 쉬벡 주입할 수 있게 해준다. 이를 통해 데이터베이스 엔티티와의 상호작용을 관리하는 코드를 구조화하고 간소화할 수 있다.
- `typeorm` : 이것은 typeORM 라이브러리 본체로, 데이터베이스 엔티티 정의, 연결 설정, 데이터베이스 쿼리 실행 등 데이터베이스와 상호작용을 관리하는 데 필요한 모든 기능을 제공한다. 
- `pg` : 이 패키지는 PostgreSQL 데이터베이스를 위한 Node.js 클라이언트이다. TypeORM이 PostgreSQL과 통신할 수 있도록 해준다. `pg`는 PostGreSQK 데이터베이스와의 저수준 연결 및 쿼리 실행 기능을 제공한다.

### 6. ConfigService
```
npm i @nestjs/config --save
```
환경 변수를 관리하기 위한 모듈로 이 모듈은 내부적으로 `dotenv` 패키지를 사용하여 `.env` 파일에서 환경 변수를 로드한다. 환경 변수는 애플리케이션의 중요한 설정 정보를 외부에서 주입하는 데 사용되며, 코드 내에 하드코딩하지 않고도 이러한 정보들을 관리할 수 있게 해주어 보안성을 올린다.

```
npm i cross-env

```
Node.js 스크립에서 운영 체제 간 환경 변수 설정의 차이를 추상화하는 도구이다. `cross-env`를 사용하면, 플랫폼에 상관없이 일관된 방식으로 환경 변수를 설정할 수 있다. 이는개발 환경을 다양핞 운영체제에서 운영하는 티멩게 유용하다. `package.json`의 스크립트 섹션에서 다음과 같이 사용할 수 있다.

```
"start:dev": "cross-env NODE_ENV=dev nest start --watch",
```

```
npm i joi
```
Joi는 JavaScript 프로젝트에서 사용할 수 있는 스키마 기반의 데이터 유효성검사기이다. 데이터의 구조와 타입을 정의하는 스키마를 만들고, 이 스키마를 사용해 JavaScript 객체의 유효성을 검증할 수 있다. Joi는 다양한 유형의 데이터 검증을 위한 광범위한 옵션과 규칙을 제공한다.
- 환경 변수 검증 : NestJS에서 구성 관리를 할 때, Joi를 활용해 `.env` 파일이나 환경 변수의 유효성을 검증할 수 있다. 이는 애플리케이션의 구성이 기대하는 형식과 일치하는지 확인하는 데 유용하다.
- 입력 데이터 검증 : API 엔드포인트에 전달된 데이터의 구조와 타입이 올바른지 검증하는 데 사용할 수 있다.

```
npm install @nestjs/schedule

```
NestJS에서 `ScheduleModule`은 애플리케이션 내에서 예약된 작업을 실행하는 데 사용된다. 이 모듈은 cron jobs, timeouts, 그리고 intervals 같은 시간 기반 작업을 쉽게 관리할 수 있게 해준다.

<!-- 
## User CRUD
```
nest g mo users
```
### 1. TypeORM special columns

추가 기능을 사용할 수 있는 몇 가지 Special columns들이 있습니다.

@CreateDateColumn은 엔터티의 삽입 날짜로 자동 설정되는 특수 열입니다. 이 열은 설정할 필요가 없습니다. 자동으로 설정됩니다.

@UpdateDateColumn은 entity manager 또는 repository의 저장을 호출할 때마다 엔티티의 업데이트 시간으로 자동 설정되는 특수 컬럼입니다. 이 열은 설정할 필요가 없습니다. 자동으로 설정됩니다.

@DeleteDateColumn은 entity manager 또는 repository의 일시 삭제를 호출할 때마다 엔터티의 삭제 시간으로 자동 설정되는 특수 열입니다. 이 열은 설정할 필요가 없습니다. 자동으로 설정됩니다. @DeleteDateColumn이 설정되면 기본 범위는 "삭제되지 않음"이 됩니다.

https://typeorm.io/#/entities/special-columns

GraphQLError [Object]: Query root type must be provided
터미널에 위와 같은 오류 뜨시는 분들은 지금 아직 Query를 하나도 만들지 않아도 뜨는 오류이기 때문에 그냥 다음 강의로 넘어가셔도 됩니다.

### 2. Enums
enum은 특정 허용 값 집합으로 제한되는 특수한 종류의 스칼라입니다.
이 유형의 모든 인수가 허용되는 값 중 하나인지 확인
필드가 항상 유한한 값 집합 중 하나임을 유형 시스템을 통해 전달

code first 접근 방식을 사용할 때 TypeScript enum을 생성하여 GraphQL enum type을 정의합니다.
registerEnumType 함수를 사용하여 AllowedColor enum을 등록합니다.
```
export enum AllowedColor {
RED,
GREEN,
BLUE,
}
registerEnumType(AllowedColor, { name: 'AllowedColor' });
```
https://docs.nestjs.com/graphql/unions-and-enums#code-first-1
https://www.typescriptlang.org/ko/docs/handbook/enums.html



### 3. 비밀번호 털렸다고? 암호화. 해시함수. 5분 설명
https://www.youtube.com/watch?v=67UwxR3ts2E

Entity Listeners and Subscribers
모든 엔터티에는 특정 엔터티 이벤트를 listen하는 커스텀 로직 메서드를 가질 수 있습니다.
그래서 listen하려는 이벤트를 메서드에 특별한 데코레이터로 마크해줍니다.
주의! listener 내에서 데이터베이스 호출을 수행하지 말고, 대신 subscribers를 선택하십시오.
https://typeorm.io/#/listeners-and-subscribers

@BeforeInsert
이 엔터티 삽입 전에 이 데코레이터가 적용되는 메서드를 호출합니다.
엔티티에 메소드를 정의하고 @BeforeInsert 데코레이터로 표시하면 TypeORM은 엔티티가 repository/manager save를 사용하여 insert되기 전에 이 메서드를 호출합니다.
ex) mongoose에서 pre save처럼 DB에 저장되기 전에 실행되는 함수
```
@BeforeInsert()
updateDates() {
this.createdDate = new Date();
}
```
https://typeorm.io/#/listeners-and-subscribers/beforeinsert

bcrypt
npm i bcrypt
npm i @types/bcrypt -D
https://www.npmjs.com/package/bcrypt

주의! import * as bcrypt from 'bcrypt';가 아닌
import bcrypt from 'bcrypt';로 import하게 되면 bcrypt에 함수가 아닌 undefined가 담겨 hash함수가 제대로 동작하지 않는 문제가 있음

### 4. Authentication

인증은 대부분의 애플리케이션에서 필수적인 부분입니다.Passport는 커뮤니티에서 잘 알려져 있고 많은 프로덕션 애플리케이션에서 성공적으로 사용되는 가장 인기 있는 node.js 인증 라이브러리입니다.
@nestjs/passport 모듈을 사용하여 이 라이브러리를 Nest 애플리케이션과 통합하는 것은 간단합니다.

https://docs.nestjs.com/security/authentication

### 5. Dynamic modules
Nest 모듈 시스템에는 동적 모듈이라는 강력한 기능이 포함되어 있습니다.
이 기능을 사용하면 커스터마이징 가능한 모듈을 쉽게 만들 수 있게 합니다.
커스터마이징 가능한 모듈은 provider를 등록하고 동적으로 구성할 수 있습니다.
https://docs.nestjs.com/fundamentals/dynamic-modules#dynamic-modules
https://docs.nestjs.com/modules#dynamic-modules

NestJS에서의 Modules 개념
모듈은 @Module() 데코레이터로 주석이 달린 클래스입니다.
@Module() 데코레이터는 Nest가 애플리케이션 구조를 구성하는 데 사용하는 메타데이터를 제공합니다.
https://docs.nestjs.com/modules

Static Module (정적 모듈)
어떠한 설정도 적용되어 있지 않은 모듈

Dynamic Module (동적 모듈)
설정이 적용되어 있거나 설정을 적용할 수 있는 모듈

JWT
https://jwt.io

https://docs.nestjs.com/modules#dynamic-modules

Global modules
즉시 사용할 수 있는 모든 제공자 세트(예: 도우미, 데이터베이스 연결 등)를 제공하려면 @Global() 데코레이터를 사용하여 모듈을 전역적으로 만드십시오.
또는 forRoot안에서 global: true를 통해서도 전역 모듈로 만들 수 있다.
```
return {
global:true
module: JwtModule,
providers: [JwtService],
exports: [JwtService],
};
```
https://docs.nestjs.com/modules#global-modules

### 6. Standard providers
아래 코드는 providers: [CatsService]의 축약형입니다.
```
providers: [
{ provide: CatsService, useClass: CatsService },
];
```
https://docs.nestjs.com/fundamentals/custom-providers#standard-providers

useClass (Class providers)
provider의 타입 (주입되야 할 인스턴스 클래스 이름)
프로바이더로 사용할 클래스?
useClass 구문을 사용하면 토큰이 해결해야 하는 클래스를 동적으로 결정할 수 있습니다.
예를 들어 추상(또는 기본) ConfigService 클래스가 있다고 가정합니다.
현재 환경에 따라 Nest가 구성 서비스의 다른 구현을 제공하기를 바랍니다.
```
useClass:
process.env.NODE_ENV === 'development'
? DevelopmentConfigService
: ProductionConfigService,
```
https://docs.nestjs.com/fundamentals/custom-providers#class-providers-useclass

useValue (Value providers)
주입한 provider의 인스턴스
useValue 구문은 상수 값을 주입하거나 외부 라이브러리를 Nest 컨테이너에 넣거나 실제 구현을 모의 객체로 교체하는 데 유용합니다.
https://docs.nestjs.com/fundamentals/custom-providers#value-providers-usevalue

### 7. Middleware
미들웨어는 라우트 핸들러 전에 호출되는 함수입니다. 미들웨어 함수는 request 및 response 객체에 접근할 수 있으며 애플리케이션의 request-response 주기에 있는 next() 미들웨어 함수에 접근할 수 있습니다. next 미들웨어 함수는 일반적으로 next라는 변수로 표시됩니다.
Nest 미들웨어는 기본적으로 익스프레스 미들웨어와 동일합니다.
함수 또는 @Injectable() 데코레이터가 있는 클래스에서 사용자 지정 Nest 미들웨어를 구현합니다.
https://docs.nestjs.com/middleware#middleware

Applying middleware (미들웨어 적용)
@Module() 데코레이터에는 미들웨어가 들어갈 자리가 없습니다. 대신 모듈 클래스의 configure() 메서드를 사용하여 설정합니다. 미들웨어를 포함하는 모듈은 NestModule 인터페이스를 implement해야 합니다.
https://docs.nestjs.com/middleware#applying-middleware

Middleware consumer
MiddlewareConsumer는 도우미 클래스입니다. 미들웨어를 관리하는 몇 가지 기본 제공 방법을 제공합니다. forRoutes() 메서드는 단일 문자열, 여러 문자열, RouteInfo 객체, 컨트롤러 클래스 및 여러 컨트롤러 클래스를 사용할 수 있습니다. 대부분의 경우 쉼표로 구분된 컨트롤러 목록을 전달할 것입니다.

apply()
apply() 메서드는 단일 미들웨어를 사용하거나 여러 인수를 사용하여 여러 미들웨어를 지정할 수 있습니다.

exclude()
지정한 경로에서 미들웨어의 실행을 제외합니다.

forRoutes()
전달된 경로 또는 컨트롤러에서 미들웨어를 실행합니다. 클래스를 전달하면 Nest는 이 컨트롤러 내에 정의된 모든 경로에 미들웨어를 실행합니다.
https://docs.nestjs.com/middleware#middleware-consumer


jwt.verify(token, secretOrPublicKey, [options, callback])
ex) var decoded = jwt.verify(token, 'shhhhh');
https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback

jwt.decode(token [, options])
서명이 유효한지 확인하지 않고 디코딩된 페이로드를 반환합니다.
주의! 이것은 서명이 유효한지 여부를 확인하지 않습니다. 신뢰할 수 없는 메시지에는 이것을 사용하지 마십시오. 대신 jwt.verify를 사용하고 싶을 것입니다.
https://www.npmjs.com/package/jsonwebtoken#jwtdecodetoken--options

현재 여기서 JwtMiddleware가 하는 역할
1. request headers안에 token을 가져온다.
2. 가져온 token을 jwt.verify()를 이용해서 토큰을 검증하고 payload를 반환한다.
3. 반환한 payload를 이용해서 유저를 찾는다.
4. 유저를 찾았다면 찾은 유저의 정보를 req에 다시 넣어 다음 미들웨어에 전달한다.

### 8. Context
각 request에 대해 request context를 사용할 수 있습니다. context가 함수로 정의되면 각 request마다 호출되고 req 속성에 request 객체를 받습니다.
```
context: async ({ req }) => {
return {
myProperty: true
};
},
```
https://github.com/apollographql/apollo-server#context

@Context()
ex) @Context() context로 context를 가져오거나
@Context("loggedInUser") loggedInUser로 context안에 loggedInUser가 있다면 바로 가져올 수도 있습니다.
```
@Context(param?: string) // NestJS

context / context[param] // Apollo
```
https://docs.nestjs.com/graphql/resolvers#graphql-argument-decorators

### 9. Guards
가드는 CanActivate 인터페이스를 구현하는 @Injectable() 데코레이터로 주석이 달린 클래스입니다.
런타임에 존재하는 특정 조건에 따라 주어진 요청이 경로 핸들러에 의해 처리되는지 여부를 결정합니다.
이것을 흔히 권한 부여라고 합니다.권한 부여는 일반적으로 기존 Express 애플리케이션의 미들웨어에 의해 처리되었습니다.
그러나 미들웨어는 본질적으로 멍청합니다.next() 함수를 호출한 후 어떤 핸들러가 실행될지 모릅니다.
Guards는 ExecutionContext 인스턴스에 액세스할 수 있으므로 다음에 실행될 항목을 정확히 알고 있습니다.
토큰을 추출 및 검증하고 추출된 정보를 사용하여 요청을 진행할 수 있는지 여부를 결정합니다.
https://docs.nestjs.com/guards

@UseGuard() (Binding guards)
파이프 및 예외 필터와 마찬가지로 가드는 컨트롤러 범위, 메서드 범위 또는 전역 범위일 수 있습니다. 아래에서 @UseGuards() 데코레이터를 사용하여 컨트롤러 범위 가드를 설정합니다.
https://docs.nestjs.com/guards#binding-guards

GqlExecutionContext (Execution context)
GraphQL은 들어오는 요청에서 다른 유형의 데이터를 수신하기 때문에 가드와 인터셉터 모두에서 수신하는 실행 컨텍스트는 GraphQL과 REST에서 다소 다릅니다. GraphQL resolver에는 root, args, context, and info와 같은 고유한 인수 집합이 있습니다. 따라서 가드와 인터셉터는 일반 ExecutionContext를 GqlExecutionContext로 변환해야 합니다.
ex) const ctx = GqlExecutionContext.create(context);
https://docs.nestjs.com/graphql/other-features#execution-context

authentication: 토큰의 유효성 확인
authorization: 유저가 어떤 일을 하기 전에 그 일을 할 수 있는 권한이 있는지 확인

### 10. Custom decorators

나만의 커스텀 데코레이터를 만들 수 있습니다. node.js 세계에서는 request 객체에 속성을 첨부하는 것이 일반적입니다.
코드를 더 읽기 쉽고 투명하게 만들기 위해 @User() 데코레이터를 만들고 모든 컨트롤러에서 재사용할 수 있습니다.

예시
```
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
(data: unknown, ctx: ExecutionContext) => {
const request = ctx.switchToHttp().getRequest();
return request.user;
},
);
```
https://docs.nestjs.com/graphql/other-features#custom-decorators
https://docs.nestjs.com/custom-decorators

### 11. update()
엔티티를 부분적으로 업데이트합니다. 엔티티는 주어진 조건으로 찾을 수 있습니다. save 메소드와 달리 캐스케이드, 관계 및 기타 작업이 포함되지 않은 기본 작업을 실행합니다. 빠르고 효율적인 UPDATE 쿼리를 실행합니다. 데이터베이스에 엔터티가 있는지 확인하지 않습니다.
ex) this.usersRepository.update(id, { email, password })

update()메서드 반환값: UpdateResult
UpdateQueryBuilder 실행에 의해 반환된 결과 객체입니다.

+editProfile에서 이메일을 수정할 때, 이미 존재하는 지는 체크 필요

### 12. @BeforeUpdate()

save()메서드를 사용하여 업데이트되기 전에 실행되는 데코레이터이다.
엔티티에 메소드를 정의하고 @BeforeUpdate() 데코레이터를 사용하면 TypeORM이 기존 엔티티를 repository/manager save을 사용하여 업데이트되기 전에 이를 호출합니다.
그러나 모델에서 정보가 변경된 경우에만 @BeforeUpdate() 데코레이터가 실행한다는 점에 유의하십시오. 모델에서 아무 것도 수정하지 않고 저장을 실행하면 @BeforeUpdate 및 @AfterUpdate가 실행되지 않습니다. (update메서드를 사용할 때는 실행하지 않음)

https://github.com/typeorm/typeorm/blob/master/docs/listeners-and-subscribers.md#beforeupdate


## Email Verification
### 1. One-to-one relations (1:1관계)

일대일 관계는 A가 B의 인스턴스를 하나만 포함하고 B가 A의 인스턴스를 하나만 포함하는 관계입니다. 예를 들어 사용자 및 프로필 엔터티를 보면, 사용자는 하나의 프로필만 가질 수 있으며, 프로필은 하나의 사용자만 가질 수 있습니다.

프로필에 @OneToOne을 추가하고 대상 관계 유형을 프로필로 지정했습니다.
또한 relation의 한쪽에만 설정해야 하는 @JoinColumn() 을 추가했습니다. (@JoinColumn()은 필수로 지정해야 함)
@JoinColumn()을 설정한 쪽의 테이블에는 해당되는 엔터티 테이블에 대한 relation id와 foreign keys가 포함됩니다.
@JoinColumn은 관계의 한 쪽, 즉 데이터베이스 테이블에 foreign key가 있어야 하는 쪽에만 설정해야 합니다.

요약: Verification을 통해 그 안에 User에 접근해서 User의 emailVerified를 false에서 true로 바꿀 것이기 때문에 Verification쪽에 @JoinColumn()을 추가하고 user를 통해 생성한 foreign key인 userId을 추가하도록 한 것이다.
```
@OneToOne(() => Profile)
@JoinColumn()
profile: Profile;

위와 같이 설정시 데이터베이스에는 profile에 대한 foreign key가 생김
profileId | int(11) | FOREIGN KEY
```
https://typeorm.io/#/one-to-one-relations


### 2. uuid
npm i uuid
```
import { v4 as uuidv4 } from 'uuid';
uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
```
https://www.npmjs.com/package/uuid

uuid 앞에 4개 문자만 추출해서 저장하기
uuidv4().substring(0, 4).toUpperCase() // CF26

Verification엔티티를 생성하고 난 후 user에 위에서 생성한 User 엔티티를 넣을 때 주의할 점은 await this.userRepository.save(createdUser)를 통해 모델을 DB에 완전히 저장한 후 넣어줘야 한다. 그렇지 않으면 user에 User데이터가 제대로 들어가지 않고, null값이 들어가게 된다.
```
await this.verificationRepository.create({
code: '',
user: createdUser,
});
```

자바스크립트로 랜덤 문자열 추출하기
Math.random().toString(36).substring(2)

7:24초 부분에서 영상 멈춘 이후, 작성한 코드입니다.
영상 멈추면 새로고침 후 7:28초쯤으로 돌려서 재생해보세요.
await this.verifications.save(this.verifications.create({ user }));

### 3. relations
Prisma에서처럼 TypeORM에서도 관계를 가지고 있는 필드는 TypeORM에 따로 지정하지 않으면 자동으로 해당 필드를 보여주지 않는다.

loadRelationIds: true
true로 설정시 relation id값을 가져온다. (userId: 10)
엔터티의 모든 관계 ID를 로드하고 관계 개체가 아닌 관계 값에 매핑합니다.

relations
loadRelationIds를 통해 relation id만 가져올 수도 있고, relations를 통해 해당 필드의 전체 데이터를 가져올 수도 있다.
```
await this.verificationRepository.findOne({ code },{ relations: ['user'] },);

await userRepository.find({ relations: ["profile"] });
```

### 4. 다른 방법
비밀번호를 해시하지 않고 emailVerified를 false에서 true로 업데이트 하는 또 다른 방법입니다.
앞서 update()를 실행하게 되면 @BeforeUpdate()데코레이터가 실행되지 않는 것을 이용해서 아래와 같이 간단하게 update()메서드를 이용해서 verified를 true로 바꿔줄 수도 있습니다.
(password컬럼에 select:false를 지정해주지 않아도 됩니다.)
ex) await this.userRepository.update(foundVerification.user.id, { emailVerified: true });

@Column({ select: false })
QueryBuilder나 find 실행자(find메서드들)를 통해 해당 엔티티를 가져올 때 해당 column을 항상 선택되어질지 여부를 나타냅니다. 기본값은 "true"입니다.
false로 지정하게 되면 해당 column을 DB로부터 찾아오지 않는다.
https://typeorm.delightful.studio/interfaces/_decorator_options_columnoptions_.columnoptions.html

### 5. Mailgun
개발자를 위한 트랜잭션 이메일 API 서비스
https://www.mailgun.com

Receive SMS Online
온라인으로 즉시 SMS 수신
https://receive-smss.com/

### 6. NestJS Mailer
Nodemailer 라이브러리를 사용하는 Nest.js 프레임워크(node.js)용 메일러 모듈
https://nest-modules.github.io/mailer
https://github.com/nest-modules/mailer

Dynamic module use case
https://docs.nestjs.com/fundamentals/dynamic-modules#dynamic-module-use-case

MAILGUN_API_KEY
MAILGUN_DOMAIN_NAME
MAINGUN_FROM_EMAIL

### 7. Mailgun API
cURL (Client URL)
URL로 데이터를 전송하기 위한 커맨드 라인 툴 및 라이브러리
curl은 데이터를 전송하기 위해 명령줄이나 스크립트에서 사용됩니다.
curl은 다양한 통신 프로토콜을 이용하여 데이터를 전송하기 위한 라이브러리와 명령 줄 도구를 제공하는 컴퓨터 소프트웨어 프로젝트이다.

GOT
Node.js를 위한 인간 친화적이고 강력한 HTTP request 라이브러리
+ got 12버전 이상 사용시, 모듈을 import해올 때 오류가 발생하시는 분들은 12버전보다 아래인 11.8.3버전으로 설치해보세요
npm i got@11.8.3
https://www.npmjs.com/package/got

Form-Data
읽을 수 있는 "multipart/form-data" 스트림을 생성하는 라이브러리입니다. 다른 웹 애플리케이션에 form을 submit하고, 파일을 업로드하는 데 사용할 수 있습니다.
npm i form-data

이 예제에서는 문자열, 버퍼 및 파일 스트림을 포함하는 3개의 field가 있는 form을 구성합니다.
```
var FormData = require('form-data');
var fs = require('fs');

var form = new FormData();
form.append('my_field', 'my value');
form.append('my_buffer', new Buffer(10));
form.append('my_file', fs.createReadStream('/foo/bar.jpg'));
```
https://www.npmjs.com/package/form-data

Mailgun Doc
https://documentation.mailgun.com/en/latest/quickstart-sending.html#how-to-start-sending-email

Buffer란? Node.js 에서 제공하는 Binary의 데이터를 담을 수 있는 객체
Binary 데이터란? 01001010과 같은 이진수 시스템으로 표현되는 데이터

Node.js방식으로 Mailgun으로 메일 보내기

cURL와 got을 사용하지 않고, Node.js방식으로도 아래와 같이 메일을 보낼 수 있습니다.
mailgun.js을 require('mailgun.js')가 아닌 import로 가져오려면
tsconfig.json에 compilerOptions에 esModuleInterop를 true로 설정해주시면 됩니다.
```
import formData from 'form-data';
import Mailgun from 'mailgun.js';

sendEmail(){
const mailgun = new Mailgun(formData);
const client = mailgun.client({ username: 'Nuber', key: this.mailOptions.mailgunApiKey });

const messageData = {
from: 'Nuber @mailgun-test.com>',
to: 'nubereats@gmail.com',
subject: 'Hello',
template: 'nuber-eats',
'v:username': 'test',
'v:code': 'abcd123',
};

const response = await client.messages.create(this.mailOptions.mailgunDomainName, messageData);
console.log('response', response);
}
```
https://documentation.mailgun.com/en/latest/quickstart-sending.html#how-to-start-sending-email
https://www.npmjs.com/package/mailgun.js

## Restaurant CRUD
### 1. Many-to-one / one-to-many relations

다대일/일대다 관계는 A가 B의 여러 인스턴스를 포함하지만 B는 A의 인스턴스를 하나만 포함하는 관계입니다. User 및 Photo 엔터티를 예로 들어 보겠습니다. 사용자는 여러 장의 사진을 가질 수 있지만 각 사진은 한 명의 사용자만 소유합니다.

@OneToMany(): 일대다 관계에서 '다'에 속할 때 사용
(DB에 해당 컬럼은 저장되지 않음)
@ManyToOne(): 일대다 관계에서 '일'에 속할 때 사용
(DB에 user면 userId로 id값만 저장됨)
```
@Entity()
export class Photo {
@ManyToOne(() => User, user => user.photos)
user: User;
}

@Entity()
export class User {
@OneToMany(() => Photo, photo => photo.user)
photos: Photo[];
}
```
https://typeorm.io/#/many-to-one-one-to-many-relations

### 2. Setting roles per handler(핸들러별 역할 설정): @SetMetadata()

예를 들어 CatsController는 다른 route에 대해 다른 권한 체계를 가질 수 있습니다. 일부는 관리자만 사용할 수 있고 다른 일부는 모든 사람에게 공개될 수 있습니다. 유연하고 재사용 가능한 방식으로 role을 route에 사용하려면 어떻게 해야 합니까?
여기서 custom metadata가 작동합니다. Nest는 @SetMetadata() 데코레이터를 통해 라우트 핸들러에 커스텀 메타데이터를 붙이는 기능을 제공합니다.
ex) @SetMetadata('role', Role.Owner)
key - 메타데이터가 저장되는 키를 정의하는 값
value - 키와 연결될 메타데이터

route에서 직접 @SetMetadata()를 사용하는 것은 좋은 습관이 아닙니다. 대신 아래와 같이 자신만의 데코레이터를 만듭니다.
```
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```
https://docs.nestjs.com/guards#setting-roles-per-handler

### 3. AushGuard
Global 가드는 모든 컨트롤러와 모든 route handler에 대해 전체 애플리케이션에서 사용됩니다.
dependency injection 관점에서, 모듈 외부에서 등록된 전역 가드(위의 예에서와 같이 useGlobalGuards() 사용)는 dependency injection을 할 수 없습니다. 이는 이것이 모든 모듈의 context 외부에서 수행되기 때문입니다. 이 문제를 해결하기 위해 다음 구성을 사용하여 모든 모듈에서 직접 가드를 설정할 수 있습니다.

app.module.ts
```
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
providers: [
{
provide: APP_GUARD,
useClass: RolesGuard,
},
],
})
export class AppModule {}
```
https://docs.nestjs.com/guards#binding-guards

Metadata가 설정되어있지 않으면 public(누구나 접근 가능)
Metadata가 설정되어있으면 private(특정 role만 접근 가능하도록 제한)

Putting it all together
이제 뒤로 돌아가서 이것을 RolesGuard와 연결해 보겠습니다. 현재 사용자에게 할당된 role을 처리 중인 현재 route에 필요한 실제 role과 비교하여 반환 값을 조건부로 만들고 싶습니다.
https://docs.nestjs.com/guards#putting-it-all-together

### 4. @RelationId
속성에 특정 relation의 id를 로드합니다. 예를 들어 Post 엔터티에 Many-to-one이 있는 경우 새 속성을 @RelationId로 표시하여 새 Relation ID를 가질 수 있습니다. 이 기능은 many-to-many를 포함한 모든 종류의 관계에서 작동합니다. Relation ID는 표현용으로만 사용됩니다. 값을 연결할 때 기본 relation가 추가/제거/변경되지 않습니다.
' ' '
@Entity()
export class Post {

@ManyToOne(type => Category)
category: Category;

@RelationId((post: Post) => post.category) // you need to specify target relation
categoryId: number;
}
' ' '
https://github.com/typeorm/typeorm/blob/master/docs/decorator-reference.md#relationid

+ RelationId를 사용해도 되고, 아니면 레스토랑을 찾아올 때 아래와 같이 레스토랑의 owner가 로그인한 사용자인 레스토랑만을 찾아올 수도 있습니다.
' ' '
const foundRestaurant: Restaurant | undefined = await this.restaurantsRepository.findOne({
id: restaurantId,
owner: loggedInUser,
});
' ' '

relations?: string[];
로드해야 하는 엔티티의 관계를 나타냅니다. relation인 owner를 가져옵니다.
ex) await this.restaurantsRepository.findOne({ id: restaurantId }, { relations: ['owner'] });

loadRelationIds: boolean | object
true로 설정하면 엔티티의 모든 relation ID를 로드하고 relation 객체가 아닌 관계 값에 매핑합니다. relation인 owner의 아이디만 로드해옵니다.
ex) loadRelationIds: true
ex) { loadRelationIds: { relations: ['owner'] } },
'''
loadRelationIds?: boolean | {
relations?: string[];
disableMixedMap?: boolean;
};
'''
https://typeorm.delightful.studio/interfaces/_find_options_findmanyoptions_.findmanyoptions.html#loadrelationids

### 5. Custom repositories

데이터베이스 작업을 위한 메소드를 포함해야 하는 사용자 정의 리포지토리를 생성할 수 있습니다.
일반적으로 사용자 지정 리포지토리는 단일 엔티티에 대해 생성되고 특정 쿼리를 포함합니다. 예를 들어, 주어진 성과 이름으로 사용자를 검색하는 findByName(firstName: string, lastName: string)이라는 메서드가 있다고 가정해 봅시다. 이 방법의 가장 좋은 위치는 Repository이므로 userRepository.findByName(...)과 같이 호출할 수 있습니다.
```
import {EntityRepository, Repository} from "typeorm";
import {User} from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository {

findByName(firstName: string, lastName: string) {
return this.findOne({ firstName, lastName });
}

}
```
https://typeorm.io/#/custom-repository

### 6. @ResolveField()

매 request마다 계산된 field값을 가져온다.
(DB에는 존재하지 않고 GraphQL 스키마에만 존재)
```
@ResolveField('posts', returns => [Post])
async getPosts(@Parent() author: Author) {
const { id } = author;
return this.postsService.findAll({ authorId: id });
}
```
https://docs.nestjs.com/graphql/resolvers

Int 오류시 => Number
@ResolveField((returns) => Number)

### 7. GraphQL argument decorators

전용 데코레이터를 사용하여 표준 GraphQL resolver arguments에 접근할 수 있습니다. 다음은 Nest 데코레이터와 이들이 나타내는 일반 Apollo 매개변수를 비교한 것입니다.
```
@Root() / @Parent() => root/parent
@Context(param?: string) => context / context[param]
@Info(param?: string) => info / info[param]
@Args(param?: string) => args / args[param]
```
https://docs.nestjs.com/graphql/resolvers#graphql-argument-decorators

### 8. find

where: 엔티티를 쿼리할 조건
skip: 스킵할 엔티티 갯수
take: 가져올 엔티티 갯수
```
userRepository.find({
where: { project: { name: "TypeORM", initials: "TORM" } },
relations: ["project"],
});

userRepository.find({
order: {
columnName: "ASC",
},
skip: 0,
take: 10,
});
```
https://typeorm.io/#/find-options/basic-options
https://github.com/typeorm/typeorm/blob/master/docs/find-options.md#basic-options

TypeORM Cursor Pagination
https://www.npmjs.com/package/typeorm-cursor-pagination

### 9. findAndCount()
주어진 기준과 일치하는 모든 엔티티를 카운트하고, 찾아옵니다.
ex) const [allPhotos, photosCount] = await photoRepository.findAndCount();

findAndCount(options?: FindManyOptions)

### 10. Like
```
import { Like } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
title: Like("%out #%"),
});

위의 코드는 아래 쿼리를 실행합니다.
SELECT * FROM "post" WHERE "title" LIKE '%out #%'
```
https://orkhan.gitbook.io/typeorm/docs/find-options#advanced-options
https://github.com/typeorm/typeorm/blob/master/docs/find-options.md#advanced-options

SQL - LIKE Clause
SQL LIKE 절은 wildcard 연산자를 사용하여 값을 유사한 값과 비교하는 데 사용됩니다. 퍼센트 기호(%)는 0, 하나 또는 여러 문자를 나타냅니다. 밑줄(_)은 단일 숫자 또는 문자를 나타냅니다. 이러한 기호는 조합하여 사용할 수 있습니다.

예시
WHERE SALARY LIKE '200%' : 200으로 시작하는 모든 값을 찾습니다.
WHERE SALARY LIKE '%200%': 어느 위치든 200이 있는 값을 찾습니다.
WHERE SALARY LIKE '_00%': 두 번째 및 세 번째 위치에 00이 있는 값을 찾습니다.
WHERE SALARY LIKE '%2': 2로 끝나는 값을 찾습니다.
https://www.tutorialspoint.com/sql/sql-like-clause.htm

### 11 ILike
현재는 문제없이 ILike사용 가능합니다.
https://orkhan.gitbook.io/typeorm/docs/find-options

ILike
ILike(`%${restaurantName}%`)
```
import { ILike } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
title: ILike("%out #%"),
});
```

Raw
Raw((name) => `${name} ILIKE '%${restaurantName}%'`)
```
import { Raw } from "typeorm";

const loadedPosts = await connection.getRepository(Post).find({
likes: Raw("dislikes - 4"),
});

const loadedPosts = await connection.getRepository(Post).find({
currentDate: Raw((alias) => `${alias} > NOW()`),
});
```

## Dish CRUD
### 1. Many-to-one / one-to-many relations

```
@Entity()
export class Photo {
@ManyToOne(() => User, user => user.photos)
user: User;
}

@Entity()
export class User {
@OneToMany(() => Photo, photo => photo.user)
photos: Photo[];
}
```
https://typeorm.io/#/many-to-one-one-to-many-relations

### 2. Column Types

TypeORM은 가장 일반적으로 사용되는 데이터베이스 지원 Column type을 모두 지원합니다. Column type은 데이터베이스 유형에 따라 다릅니다. 이는 데이터베이스 스키마가 어떻게 생겼는지에 대해 더 많은 유연성을 제공합니다. Column type을 @Column의 첫 번째 매개변수로 지정하거나 @Column의 column 옵션에서 지정할 수 있습니다.
```
@Column("int")
@Column({ type: "int" })
@Column("varchar", { length: 200 })
@Column({ type: "int", width: 200 })
```
https://orkhan.gitbook.io/typeorm/docs/entities#column-types


## Order CRUD

### 1. Many-to-many relations

다대다 관계는 A가 B의 여러 인스턴스를 포함하고 B가 A의 여러 인스턴스를 포함하는 관계입니다. Question 및 Category 엔터티를 예로 들어 보겠습니다. Question에는 여러 Category가 있을 수 있으며 각 Category에는 여러 Question이 있을 수 있습니다. @ManyToMany 관계에는 @JoinTable()이 필요합니다. @JoinTable은 관계의 한쪽(소유) 쪽에 넣어야 합니다.
```
@ManyToMany(() => Category)
@JoinTable()
categories: Category[]
```
https://typeorm.io/#/many-to-many-relations
https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations

### 2. for...of

for...of 명령문은 반복가능한 객체 (Array, Map, Set, String, TypedArray, arguments 객체 등을 포함)에 대해서 반복하고 각 개별 속성값에 대해 실행되는 문이 있는 사용자 정의 반복 후크를 호출하는 루프를 생성합니다.
```
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
console.log(element);
}

// expected output: "a"
// expected output: "b"
// expected output: "c"
```
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for...of

### 3. Array.prototype.flat()

ex) const newArr = arr.flat([depth])
flat() 메서드는 모든 하위 배열 요소를 지정한 깊이까지 재귀적으로 이어붙인 새로운 배열을 생성합니다. dept는 중첩 배열 구조를 평탄화할 때 사용할 깊이 값. 기본값은 1입니다.

// 중첩 배열 평탄화
```
[ [1], [2], [], [], [5], [6] ].flat()
// [1, 2, 5, 6]

const arr1 = [1, 2, [3, 4]];
arr1.flat();
// [1, 2, 3, 4]

const arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```
// 배열 구멍 제거
```
const arr5 = [1, 2, , 4, 5];
arr5.flat();
// [1, 2, 4, 5]
```
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/flat



## Order Subscriptions
### 1. graphql-subscriptions

GraphQL subscriptions은 GraphQL에서 subscriptions을 구현하기 위해 Redis와 같은 pubsub 시스템과 GraphQL을 연결할 수 있는 간단한 npm 패키지입니다.
모든 GraphQL 클라이언트 및 서버(Apollo뿐만 아니라)와 함께 사용할 수 있습니다.

npm i graphql-subscriptions
https://www.npmjs.com/package/graphql-subscriptions

Subscriptions 활성화
subscriptions을 활성화하려면 installSubscriptionHandlers 속성을 true로 설정하십시오.
ex) installSubscriptionHandlers: true
https://docs.nestjs.com/graphql/subscriptions

### 2. Pubsub

```
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const resolvers = {
Subscription: {
somethingChanged: {
subscribe: () => pubsub.asyncIterator("hello"),
},
},
}

// pubsub.publish를 사용할 때마다 우리가 사용하는 전송을 사용하여 publish합니다.
pubsub.publish("hello", { somethingChanged: { id: "123" }});
```
https://www.apollographql.com/docs/graphql-subscriptions/setup/#pubsub

### 3. graphql-redis-subscriptions

https://github.com/davidyaha/graphql-redis-subscriptions

### 4. Filtering subscriptions

Subscriptions을 사용할 때 특정 이벤트를 필터링하려면 필터 속성을 필터 함수로 설정할 수 있습니다.

payload: pubsub.publish()를 통해 전달한 객체
variables: subscription에 전달한 객체(인자)
context: gqlContext객체
```
@Subscription(returns => Comment, {
filter: (payload, variables, context) =>
payload.commentAdded.title === variables.title,
})
commentAdded(@Args('title') title: string) {
return pubSub.asyncIterator('commentAdded');
}
```
https://docs.nestjs.com/graphql/subscriptions#filtering-subscriptions

### 5. Mutating subscription payloads (resolve)

resolver함수가 리턴하는 값은 pubsub.asyncIterator()를 통해 받는 값이 됩니다. publish한 event payload를 변형하려면 resolve 속성을 함수로 설정합니다. 함수는 이벤트 payload를 수신하고 적절한 값을 반환합니다.
```
@Subscription(returns => Comment, {
resolve: value => value,
})
commentAdded() {
return pubSub.asyncIterator('commentAdded');
}
```
https://docs.nestjs.com/graphql/subscriptions#mutating-subscription-payloads

### 6. Eager relations
Eager relation은 데이터베이스에서 엔티티를 로드할 때마다 자동으로 relation 필드들을 로드합니다. (eager: true를 추가)
```
@ManyToMany(type => Category, category => category.questions, {
eager: true
})
@JoinTable()
categories: Category[];
```
https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations#eager-relations

Lazy relations
Lazy relation은 해당 필드에 접근하면 로드됩니다. Lazy relation은 타입으로 Promise를 가져야 합니다. Promise에 값을 저장하고 로드할 때도 Promise를 반환합니다.
```
@ManyToMany(type => Question, question => question.categories)
questions: Promise< Question[]>;

@ManyToMany(type => Category, category => category.questions)
@JoinTable()
categories: Promise< Category[]>;

const question = await connection.getRepository(Question).findOne(1);
const categories = await question.categories;
```
https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations#lazy-relations


## Payments

### 1. Many-to-one / one-to-many relations

@OneToMany는 @ManyToOne 없이 존재할 수 없습니다.
@OneToMany를 사용하려면 @ManyToOne이 필요합니다.
그러나 역은 필요하지 않습니다. @ManyToOne 관계에만 관심이 있다면 관련 엔터티에 @OneToMany 없이 관계를 정의할 수 있습니다.
@ManyToOne을 설정한 위치: 관련 엔터티에는 "relation ID"와 foreign key가 있습니다.
```
@ManyToOne(() => User, (user) => user.photos)
user: User

@OneToMany(() => Photo, (photo) => photo.user)
photos: Photo[]
```
https://typeorm.io/many-to-one-one-to-many-relations

### 2. Task Scheduling
Task Scheduling을 사용하면 고정된 날짜/시간, 반복 간격 또는 지정된 간격마다 특정 메서드나 함수를 한 번 실행되도록 예약할 수 있습니다.
Node.js의 경우 cron과 유사한 기능을 애뮬레이트하는 여러 패키지가 있는데, Nest는 인기있는 Node.js node-cron 패키지와 통합되는 @nestjs/schedule 패키지를 제공합니다.
https://docs.nestjs.com/techniques/task-scheduling

패키지 설치
npm install --save @nestjs/schedule
npm install --save-dev @types/cron

Cron 패턴(순서)
초, 분, 시, 일, 월, 요일

Declarative intervals
메서드가 (반복적으로) 지정된 간격으로 실행되어야 한다고 선언하려면 메서드 정의에 @Interval() 데코레이터를 접두어로 붙입니다.
간격 값을 밀리초 단위의 숫자로 데코레이터에 전달합니다.
https://docs.nestjs.com/techniques/task-scheduling#declarative-intervals

Declarative timeouts
메서드가 지정된 시간에 한 번 실행되어야 한다고 선언하려면 메서드 정의 앞에 @Timeout() 데코레이터를 붙입니다.
오프셋(밀리 초)을 전달합니다.
https://docs.nestjs.com/techniques/task-scheduling#declarative-timeouts

Dynamic cron jobs
SchedulerRegistry API를 사용하여 코드의 어느 곳에서나 name으로 CronJob 인스턴스에 대한 참조를 가져옵니다. 먼저 표준 constructor injection을 사용하여 SchedulerRegistry를 주입합니다.
https://docs.nestjs.com/techniques/task-scheduling#dynamic-cron-jobs

### 3. Date.prototype.setDate()
setDate() 메서드는 현재 설정된 월의 시작 부분을 기준으로 Date 객체의 날짜를 설정합니다.
```
var theBigDay = new Date(1962, 6, 7); // 1962-07-07
theBigDay.setDate(24); // 1962-07-24
theBigDay.setDate(32); // 1962-08-01
theBigDay.setDate(22); // 1962-07-22
```
https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date/setDate

order
데이터를 가져올 때 내림차순 또는 오름차순으로 가져오도록 순서를 지정한다.

ASC(Ascending): 오름차순, 숫자 -1
DESC(Descending): 내림차순, 숫자 1
```
userRepository.find({
order: {
name: "ASC",
id: "DESC",
},
});
```
https://orkhan.gitbook.io/typeorm/docs/find-options

### 4. Advanced options

TypeORM은 더 복잡한 비교를 할 때, 사용할 수 있는 많은 내장 연산자를 제공합니다.
(Not, LessThan, LessThanOrEqual, MoreThan, Equal, Like, Between등)
```
await this.restaurantsRepository.find({
isPromoted: true,
promotedUntilDate: LessThan(new Date()),
});
```
https://orkhan.gitbook.io/typeorm/docs/find-options#advanced-options

## Unit Test
### 1. test.todo(name) = it.todo(name)
테스트 작성을 계획할 때 test.todo를 사용하십시오. 이 테스트는 마지막에 요약 출력에 강조 표시되어 아직 수행해야 하는 테스트의 수를 알 수 있습니다. 테스트 콜백 함수를 제공하면 test.todo에서 오류가 발생합니다. 이미 테스트를 구현했는데 테스트가 중단되어 실행하지 않으려면 대신 test.skip을 사용하십시오.
```
const add = (a, b) => a + b;

test.todo('add should be associative');
```
https://jestjs.io/docs/api#testtodoname

beforeAll(fn, timeout)
모든 테스트가 실행되기 전에 딱 한 번 함수를 실행합니다.
https://jestjs.io/docs/api#beforeallfn-timeout


### 2. moduleNameMapper
moduleNameMapper를 사용하여 모듈 경로를 다른 모듈에 매핑할 수 있습니다.
기본적으로 사전 설정은 모든 이미지를 이미지 스텁 모듈에 매핑하지만 모듈을 찾을 수 없는 경우 이 구성 옵션이 도움이 될 수 있습니다.
```
{
"moduleNameMapper": {
"my-module.js": "/path/to/my-module.js"
}
}
```
https://jestjs.io/docs/tutorial-react-native#modulenamemapper
https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring

### 3. Testing: getRepositoryToken()
단위 테스트 응용 프로그램에 관해서, 우리는 일반적으로 데이터베이스 연결을 피하고 테스트 스위트를 독립적으로 유지하고 실행 프로세스를 최대한 빠르게 유지하기를 원합니다.
그러나 우리 클래스는 연결 인스턴스에서 가져온 리포지토리에 의존할 수 있습니다.
해결책은 mock 리포지토리를 만드는 것입니다.이를 달성하기 위해 custom providers를 설정합니다.
등록된 각 리포지토리는 자동으로 < EntityName > 리포지토리 토큰으로 표시됩니다.여기서 EntityName은 엔터티 클래스의 이름입니다.
이제 대체 mockRepository가 UsersRepository로 사용됩니다. 클래스가 @InjectRepository() 데코레이터를 사용하여 UsersRepository를 요청할 때마다 Nest는 등록된 mockRepository 객체를 사용합니다.
https://docs.nestjs.com/techniques/database#testing

### 4. jest.fn(implementation)
새로운 mock 함수를 생성합니다.
선택적으로 mock implementation을 취합니다.
```
const mockFn = jest.fn();
mockFn();
expect(mockFn).toHaveBeenCalled();
```
https://jestjs.io/docs/jest-object#jestfnimplementation

### 5. Record
속성 키가 Key이고 속성 값이 Type인 객체 유형을 구성합니다.
이 유틸리티는 유형의 속성을 다른 유형에 매핑하는 데 사용할 수 있습니다.
```
interface CatInfo {
age: number;
breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record< CatName, CatInfo > = {
miffy: { age: 10, breed: "Persian" },
boris: { age: 5, breed: "Maine Coon" },
mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris;
```
https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type

Keyof Type Operator
keyof 연산자는 객체 type을 사용하여 해당 키의 문자열 또는 숫자 리터럴 통합을 생성합니다.
```
type Point = { x: number; y: number };
const hello: keyof Point; // hello에는 x, y만 할당 가능
```
https://www.typescriptlang.org/docs/handbook/2/keyof-types.html

### 6. mockFn.mockResolvedValue(value)

비동기(async) 테스트를 할 때, 비동기(async) 함수를 mock하는 데 유용합니다.
```
test('async test', async () => {
const asyncMock = jest.fn().mockResolvedValue(43);

await asyncMock(); // 43
});
```
https://jestjs.io/docs/mock-function-api#mockfnmockresolvedvaluevalue

### 7. coveragePathIgnorePatterns [array< string >]
Default: ["/node_modules/"]
테스트를 실행하기 전에 모든 파일 경로와 일치하는 정규 표현식 패턴 문자열의 배열입니다.
파일 경로가 패턴 중 하나와 일치하면 해당 파일을 스킵합니다.
https://jestjs.io/docs/configuration#coveragepathignorepatterns-arraystring

collectCoverageFrom [array]
Default: undefined
패턴이 일치하는 파일을 Coverage에 올립니다.
적용 범위 정보를 수집해야 하는 파일 집합을 나타내는 glob 패턴의 배열입니다. 파일이 지정된 glob 패턴과 일치하는 경우 이 파일에 대한 테스트가 없고 테스트 제품군에 필요하지 않은 경우에도 해당 파일에 대한 적용 범위 정보가 수집됩니다.

+ service.ts파일만 테스트 하고 싶으신 분들은 collectCoverageFrom를 아래와 같이 지정하시면 됩니다.
```
"collectCoverageFrom": [
"**/*.service.(t|j)s"
]
```
https://jestjs.io/docs/configuration#collectcoveragefrom-array

.toMatchObject(object)
.toMatchObject를 사용하여 JavaScript 개체가 개체 속성의 하위 집합과 일치하는지 확인합니다.

### 8. expect.any(constructor)

expect.any(constructor)는 주어진 생성자로 생성된 모든 것과 일치하거나 전달된 유형의 프리미티브인 경우 일치합니다. 리터럴 값 대신 toEqual 또는 toBeCalledWith 내부에서 사용할 수 있습니다.
예를 들어, mock 함수가 숫자로 호출되었는지 확인하려면
```
expect(mock).toBeCalledWith(expect.any(Number));

expect(mock).toBeCalledWith(expect.any(Cat));
```

https://jestjs.io/docs/expect#expectanyconstructor

### 9. mockFn.mockRejectedValue(value)

항상 거부하는 비동기 mock 함수를 만드는 데 유용합니다.
```
test('async test', async () => {
const asyncMock = jest.fn().mockRejectedValue(new Error('Async error'));

await asyncMock(); // throws "Async error"
});
```
https://jestjs.io/docs/mock-function-api#mockfnmockrejectedvaluevalue


-->
