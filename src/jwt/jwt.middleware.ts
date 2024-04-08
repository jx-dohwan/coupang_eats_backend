import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from 'express';

@Injectable() 
export class JwtMiddleware implements NestMiddleware {
    constructor(
        private readonly JwtService: JwtService,
        private readonly usersService: UsersService
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        if ("x-jwt" in req.headers) { // 요청 헤더에 'x-jwt'키가 있는지 확인한다.
            const token = req.headers['x-jwt']; // 'x-jwt' 헤더에서 토큰을 추출한다.
            try {
                const decoded = this.JwtService.verify(token.toString()); // JwtService를 사용하여 토큰을 검증하고, 디코드된 페이로드를 가져온다.
                if (typeof decoded === "object" && decoded.hasOwnProperty('id')) { // decode된 페이로드가 객체이며, 'id' 속성을 포함하고 잇는지 확인
                    const { user, ok } = await (this.usersService.findById(decoded['id'])); // 디코드된 페이로드에서 사용자 ID를 사용하여 사용자 정보를 조회
                    if (ok) { // 사용자 정보 조회가 성공했는지 확인
                        req['user'] = user; // 조회된 사용자 정보를 요청 객체에 추가한다.
                    }
                }
            } catch (e) {

            }
        }
        next();

    }

}