import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { User, UserRole } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { Role } from "src/auth/role.decorator";
import { AuthUser } from "src/auth/auth-user.decorator";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";

@Resolver(of => User) // GraphQL 리졸버, 해당 리졸버가 user 엔티티와 관련된 기능을 처리함을 명시
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { } // 생성자를 통해 의존성 주입, resolver 내에서 사용됨

    @Mutation(returns => CreateAccountOutput) // GraphQL의 뮤테이션을 정의, CreateAccountOutput은 이 뮤테이션의 반환 타입
    async createAccount(
        @Args('input') createAccountInput: CreateAccountInput, // CreateAccountINput 타입의 객체를 input으로 인자를 받는다.
    ): Promise<CreateAccountOutput> { // 비동기 함수로, Promise를 반환
        return this.usersService.createAccount(createAccountInput);
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        return this.usersService.login(loginInput)
    }

    @Query(returns => User)
    @Role(['Any'])
    me(@AuthUser() authUser: User) {
        return authUser;
    }

    @Query(returns => UserProfileOutput)
    @Role(['Any'])
    async userProfile(
        @Args() userProfileInput: UserProfileInput,
    ): Promise<UserProfileOutput> {
        return this.usersService.findById(userProfileInput.userId)
    }

    @Mutation(returns => EditProfileOutput)
    @Role(['Any'])
    async editProfile(
        @AuthUser() authUser: User,
        @Args('input') editProfileInput: EditProfileInput
    ): Promise<EditProfileOutput> {
        return this.usersService.editProfile(authUser.id, editProfileInput);
    }

}