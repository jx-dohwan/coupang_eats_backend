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
