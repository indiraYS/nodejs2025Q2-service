import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GenericInterceptor } from './interceptor/generic.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new GenericInterceptor())
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
