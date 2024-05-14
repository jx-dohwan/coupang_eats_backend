import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// 배포용

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // Render에서 자동으로 제공되는 PORT 환경 변수 사용
  const PORT = process.env.PORT || 4000; // 포트 번호를 환경 변수로부터 가져오거나 기본값 4000 사용
  await app.listen(PORT, "0.0.0.0"); // 0.0.0.0을 사용하여 모든 네트워크 인터페이스에서 요청 수신
  console.log(`Server is running on port ${PORT}`);
}

bootstrap();
/*
// 로컬용
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  // app.enableCors({
  //   origin: 'https://studio.apollographql.com', // 허용할 출처
  //   methods: 'GET', // 허용할 HTTP 메서드
  //   allowedHeaders: 'Content-Type, Accept', // 허용할 헤더
  //   });
  await app.listen(4000);
}
bootstrap();
*/