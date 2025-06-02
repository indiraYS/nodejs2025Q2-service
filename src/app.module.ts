import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './security/auth.middleware';
import { TokenService } from './modules/token.service';
import { UserRepository } from './repository/user.repository';
import { UserService } from './modules/user.service';
import { UserController } from './controller/user.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, TokenService, UserService, UserRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('login', 'signup')
      .forRoutes('*');
  }
}
