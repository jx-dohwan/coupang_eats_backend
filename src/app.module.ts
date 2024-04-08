import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import * as Joi from 'joi';
import { User } from './users/entities/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ // 애플리케이션 전역에서 환경 변수를 사용할 수 있게 함
      isGlobal: true, // 애플리케이션의 어느 곳에서나 ConfigService를 사용할 수 있도록 함
      envFilePath: process.env.NODE_ENV === "dev" ? ".env.dev" : ".env.test", // NODE_ENV 환경 병수에 따른 .env 파일 업로드
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // prod 환경에서는 .env 파일을 무시하도록 설정
      validationSchema: Joi.object({ // Joi를 사용해 환경 변수의 유효성 검사 스키마 정의, 필수 DB 연결 정보와 NODE_ENV 값의 유효성을 검증
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({ // PostgreSQL 데이터베이스와 연결 구성
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod', // 'prod' 환경이 아닐 경우, 데이터베이스 스키마 자동 동기화
      logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test', // 'prod'와 'test' 환경이 아닐 경우, 로깅 활성화
      entities: [User, Verification], // TypeORM이 사용할 엔티티 모델 배
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // 사용할 GraphQL 서버 드라이버를 ApolloDriver로 설정한다.
      autoSchemaFile: true, // 스키마 파일을 자동으로 생성하도록 설정한다.
    }),
    ScheduleModule.forRoot(),
  
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
    }),
    AuthModule,
    CommonModule,
    UsersModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
