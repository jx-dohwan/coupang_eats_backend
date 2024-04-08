# coupang eats backend 시작하기

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