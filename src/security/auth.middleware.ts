import { NestMiddleware, Injectable, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { TokenService } from "src/modules/token.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private tokenService: TokenService) {}
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`Request to url ${req.baseUrl}`);
        const token = req.headers.authorization ?? (() => { throw new UnauthorizedException('Access token is missing or invalid') })()
        const user = this.tokenService.parse(token) ?? (() => { throw new UnauthorizedException('Access token is missing or invalid') })()
        req['user'] = user
        next();
    }
}