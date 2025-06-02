import { Controller, Get, Post, HttpCode, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import { Request } from 'express';
import { LoginPasswordSchema } from '../types/Inputs'
import { AuthSuccessResponse, Dummy, HttpResponse } from '../types/Api'
import { TokenService } from 'src/modules/token.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly tokenService: TokenService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('signup')
  @HttpCode(204)
  signup(@Req() request: Request): Promise<HttpResponse<Dummy, any>> {
    const credentials: unknown = request.body
    // console.log('signup')

    return LoginPasswordSchema.parseAsync(credentials).then((cred) => {
      return this.tokenService.signup(cred.login, cred.password)
    });
  }

  @Post('login')
  login(@Req() request: Request): Promise<HttpResponse<AuthSuccessResponse, any>> {
    const credentials: unknown = request.body
    // console.log('login')
    return LoginPasswordSchema.parseAsync(credentials).then((cred) => {
      return this.tokenService.login(cred.login, cred.password)
    });
  }
}
