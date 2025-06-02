import { randomUUID, UUID } from "node:crypto";

export class UserEntity {
    private _id: UUID
    private _version?: number;
    /** @example 1655000000 */
    private _createAt?: number;
    /** @example 1655000000 */
    private _updateAt?: number;

    constructor(private _login: string, private _password: string) {
        this._id = randomUUID()
        this._createAt = Date.now();
        this._version = 1;
    }

    public get id(): UUID {
        return this._id
    }

    public get login() {
        return this._login
    }

    public get password() {
        return this._password
    }

    public get updateAt() {
        return this._updateAt;
    }

    public get createAt() {
        return this._createAt;
    }

    public get version() {
        return this._version;
    }

    public set password(newPassword: string) {
        this._password = newPassword;
        this._updateAt = Date.now();
        this._version = this._version + 1;
    }
}