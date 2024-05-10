import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const PORT = process.env.PORT || 4000; // 환경 변수를 사용하여 포트 지정
  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}
bootstrap();

/*async function bootstrap() {
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