import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRepository } from "src/repository/user.repository";
import { HttpResponse, Dummy } from "../types/Api"
import { User } from 'Api';
import { UserEntity } from 'src/repository/user.entity';

@Injectable()
export class UserService {
    constructor(private userRepo: UserRepository) { }
    public find(id: string): User | undefined {
        const entity = this.userRepo.find(id)
        return (entity) ? this.mapDto(entity) : undefined
    }

    public add(login: string, password: string): Promise<HttpResponse<User, any>> {
        // const user = this.userRepo.get(login)
        //if (user != undefined) 

        return new Promise((resolve, reject) => {
            let entity = this.userRepo.get(login)
            if (entity != undefined) {
                resolve({ data: null, error: new BadRequestException('user already exist') })
                return
            }

            this.userRepo.add(login, password)

            entity = this.userRepo.get(login)
            if (entity == undefined) {
                resolve({ data: null, error: new InternalServerErrorException('unexpected case, user not found after add') })
                return
            }
            const res = this.mapDto(entity)
            resolve({ data: res, error: null })
        })
    }

    public list(): User[] {
        const entities = this.userRepo.list()
        return entities.map((entity) => this.mapDto(entity));
    }

    private mapDto(entity: UserEntity): User {
        return {
            id: entity.id.toString(),
            login: entity.login,
            version: entity.version,
            createAt: entity.createAt,
            updateAt: entity.updateAt
        }
    }

    public changePassword(
        id: string,
        oldPassword: string,
        newPassword: string
    ): Promise<HttpResponse<User, any>> {
        return new Promise((resolve, reject) => {
            const entity = this.userRepo.find(id)
            if (entity == undefined) {
                resolve({ data: null, error: new NotFoundException('user not found by id') })
                return
            }

            if (entity.password != oldPassword) {
                resolve({ data: null, error: new ForbiddenException('oldPassword is wrong') })
                return
            }

            entity.password = newPassword;
            this.userRepo.save(entity)

            const res = this.mapDto(entity)
            resolve({ data: res, error: null })
        })
    }

    public delete(id: string): Promise<HttpResponse<Dummy, Error>> {
        return new Promise((resolve, reject) => {
            const entity = this.userRepo.find(id)
            if (entity == undefined) {
                resolve({ data: null, error: new NotFoundException('user not found by id') })
                return
            }

            this.userRepo.delete(entity)
            resolve({ data: {}, error: null })
        })
    }
}