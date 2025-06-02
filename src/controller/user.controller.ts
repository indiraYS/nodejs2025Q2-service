import { Body, Controller, Delete, Get, NotFoundException, Param, Put, Req, HttpCode, Post } from '@nestjs/common';
import { User } from 'Api';
import { UserService } from 'src/modules/user.service';
import { TokenService } from 'src/modules/token.service';
import { Dummy, HttpResponse } from '../types/Api'
import { ChangePasswordSchema, LoginPasswordSchema, UUIDSchema } from 'src/types/Inputs';


@Controller('users')
export class UserController {
    constructor(private userService: UserService, private readonly tokenService: TokenService) { }
    @Get()
    public list(): Promise<HttpResponse<User[], any>> {
        return new Promise((resolve, reject) => resolve({ data: this.userService.list(), error: null }))
    }

    @Get(':id')
    public single(@Param('id') id: string): Promise<HttpResponse<User, any>> {
        return new Promise((resolve, reject) => {
            const user = this.userService.find(id)
            if (user) {
                resolve({ data: user, error: null })
            } else {
                reject({ data: null, error: new NotFoundException('user not found') })
            }
        })
    }

    @Put(':id')
    public change(@Param('id') id: string, @Req() request: Request): Promise<HttpResponse<User, Error>> {
        return Promise.all([UUIDSchema.parseAsync(id), ChangePasswordSchema.parseAsync(request.body)])
            .then((input) => {
                return this.userService.changePassword(input[0], input[1].oldPassword, input[1].newPassword)
            })
    }

    @Post()
    public add(@Req() request: Request): Promise<HttpResponse<User, Error>> {
        return LoginPasswordSchema.parseAsync(request.body).then((cred) => {
            // const signup = this.tokenService.signup(cred.login, cred.password)
            // return  { cred, signup}
            return this.userService.add(cred.login, cred.password)
        })
    }

    @Delete(":id")
    @HttpCode(204)
    public delete(@Param('id') id: string): Promise<HttpResponse<Dummy, Error>> {
        return UUIDSchema.parseAsync(id).then((uuid) => {
            return this.userService.delete(uuid)
        })
    }
}