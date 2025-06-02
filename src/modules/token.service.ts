import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from "src/repository/user.repository";
import { AuthSuccessResponse, Dummy, HttpResponse } from "../types/Api"
import { randomUUID } from "node:crypto";
import { UserEntity } from 'src/repository/user.entity';

@Injectable()
export class TokenService {
    private authenticationToken = new Map<string, string>()
    private static BEARER = "Bearer ";
    constructor(private userRepo: UserRepository) {}

    public signup(login: string, password: string): HttpResponse<Dummy, Error> {
        const userEntity = this.userRepo.get(login)
        if (userEntity !== undefined) {
            return { data: null, error: new BadRequestException('user already exist')}
        }
        this.userRepo.add(login, password)
        return {data: {}, error: null}
    }

    public login(login: string, password: string): HttpResponse<AuthSuccessResponse, Error> {
        const userEntity = this.userRepo.get(login)
        if (userEntity == undefined) {
            return { data: null, error: new ForbiddenException('Incorrect login or password')}
        } 
        if (userEntity.password != password) {
            return { data: null, error: new ForbiddenException('Incorrect login or password')}
        }

        const token = randomUUID()
        this.authenticationToken.set(token, userEntity.login)
        return {data: new AuthSuccessResponse(token), error: null}
    }

    public parse(authHeader: string): UserEntity | undefined {
        const token = authHeader.replace(TokenService.BEARER, "")
        const login = this.authenticationToken.get(token)
        return (login) ? this.userRepo.get(login) : undefined
    }
}