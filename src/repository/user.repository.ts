import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity'

@Injectable()
export class UserRepository {
    private credentials = new Map<string, UserEntity>();

    public add(user: string, password: string) {
        const entity = new UserEntity(user, password)
        this.credentials.set(user, entity)
    }

    public get(login: string): UserEntity | undefined {
        return this.credentials.get(login)
    }

    public find(id: string): UserEntity | undefined {
        const res =  Array.from(this.credentials).find((x) => x[1].id == id)
        return (res) ? res[1]: undefined
    }

    public save(user: UserEntity) {
        this.credentials.set(user.login, user)
    }

    public delete(user: UserEntity) {
        this.credentials.delete(user.login)
    }

    public list(): UserEntity[] {
        return Array.from(this.credentials, ([, entity]) => entity);
    }
}