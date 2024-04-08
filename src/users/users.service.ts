import { UserProfileOutput } from './dtos/user-profile.dto';
import { JwtService } from './../jwt/jwt.service';
import { Verification } from './entities/verification.entity';
import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';

@Injectable() // 이 클래스가 서비스로서 NestJS에 의해 인스턴스화되고 관리될 수 있음을 나타냄
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
        private readonly jwtService: JwtService
    ) { }

    async createAccount({ // 사용자 계정을 생성하는 비즈니스 로직 구현
        email,
        password,
        role
    }: CreateAccountInput): Promise<CreateAccountOutput> { // 비동기 함수로 CreateaccountInput타입의 인자를 받아 처리하고, Promise<CreateAcountOutput> 타입의 결과를 반환
        try {
            const exists = await this.users.findOne({ where: { email } }); // 데이터베이스에서 주어진 이메일과 일치하는 사용자가 있는지 조회
            if (exists) { // 이미 존재하는 이메일이면, 실패 응답을 반환
                return { ok: false, error: "해당 이메일을 사용하는 사용자가 이미 있습니다." };
            }
            // 새 사용자 엔티티를 생성하고 데이터베이스에 저장
            const user = await this.users.save( // 엔티티 인스턴스를 DB에 저장거나 업데이트한다. 신규엔티티를 저장할때와 기존 엔티티를 업데이트 할 때 모두 사용한다. 즉, 필요에 따라 Insert할지, update할지 결정한다.
                this.users.create({ email, password, role }), // 주어진 객체를 사용하여 새로운 엔티티 인스턴스를 생성, 데이터를 즉시 저장하지는 않고, 인자로 받은 객체의 값을 사용하여 해당 엔티티 클래스의 새 인스턴스를 메모리에만 생성한다. 
            );
            const verification = await this.verifications.save(
                this.verifications.create({
                    user,
                }),
            );
            return { ok: true };
            // mail 인증 서비스 구현 추가해야함
        } catch (e) {
            return { ok: false, error: "계정을 만들 수 없습니다." };
        }
    }

    async login({ email, password }: LoginInput): Promise<LoginOutput> {
        try {
            const user = await this.users.findOne({
                where: { email },
                select: ['id', 'password'],
            });
            if (!user) {
                return {
                    ok: false,
                    error: "사용자를 찾을 수 없습니다."
                };
            }
            const passwordCorrect = await user.checkPassword(password);
            if (!passwordCorrect) {
                return {
                    ok: false,
                    error: "잘못된 비밀번호 입니다."
                };
            }
            const token = this.jwtService.sign(user.id);
            return {
                ok: true,
                token,
            };

        } catch (error) {
            return {
                ok: false,
                error: "사용자가 로그인할 수 없습니다."
            }
        }
    }

    async findById(id: number): Promise<UserProfileOutput> {
        try {
            const user = await this.users.findOneOrFail({ where: { id } });
            return {
                ok: true,
                user,
            };
        } catch (error) {
            return { ok: false, error: "사용자를 찾을 수 없습니다." }
        }
    }

    async editProfile(
        userId: number,
        { email, password }: EditProfileInput,

    ): Promise<EditProfileOutput> {
        try {
            const user = await this.users.findOne({ where: { id: userId } });
            if (email) {
                user.email = email;
                user.verified = false;
                await this.verifications.delete({ user: { id: user.id } });
                const verification = await this.verifications.save(this.verifications.create({ user }));
                // 추후 메일 확인 서비스를 넣을 예
            }
            if (password) {
                user.password = password;
            }
            await this.users.save(user);
            return {
                ok: true,
            };
        } catch (error) {
            return { ok: false, error: "프로파일을 업데이트할 수 없습니다." }
        }
    }
}