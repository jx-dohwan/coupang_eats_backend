import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { User, UserRole } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { Role } from "src/auth/role.decorator";
import { AuthUser } from "src/auth/auth-user.decorator";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from "./dtos/verify-email.dto";


// User 엔티티에 대한 리졸버를 정의합니다. 이 리졸버는 User 엔티티와 관련된 데이터를 처리합니다.
@Resolver(of => User)
export class UsersResolver {
    // UsersService를 이 리졸버의 생성자를 통해 의존성 주입합니다.
    // 이 서비스는 이 리졸버 내에서 사용자와 관련된 비즈니스 로직을 처리하는 데 사용됩니다.
    constructor(private readonly usersService: UsersService) { }

    // 사용자 계정 생성을 위한 뮤테이션을 정의합니다.
    // CreateAccountInput 타입의 인자를 받아, CreateAccountOutput 타입의 결과를 반환합니다.
    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        // UsersService의 createAccount 메서드를 호출하여 계정 생성 로직을 처리합니다.
        return this.usersService.createAccount(createAccountInput);
    }

    // 사용자 로그인을 위한 뮤테이션을 정의합니다.
    // LoginInput 타입의 인자를 받아, LoginOutput 타입의 결과를 반환합니다.
    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        // UsersService의 login 메서드를 호출하여 로그인 로직을 처리합니다.
        return this.usersService.login(loginInput);
    }

    // 현재 인증된 사용자의 정보를 조회하는 쿼리를 정의합니다.
    // @Role 데코레이터를 사용하여 이 쿼리에 접근할 수 있는 역할을 지정합니다.
    // 여기서는 'Any'를 지정하여 모든 역할의 사용자가 접근할 수 있도록 합니다.
    @Query(returns => User)
    @Role(['Any'])
    me(@AuthUser() authUser: User) {
        // @AuthUser 데코레이터를 사용하여 현재 인증된 사용자의 정보를 받아옵니다.
        // 이 정보는 바로 반환됩니다.
        return authUser;
    }

    // 특정 사용자의 프로필을 조회하는 쿼리를 정의합니다.
    // UserProfileInput 타입의 인자를 받아, UserProfileOutput 타입의 결과를 반환합니다.
    @Query(returns => UserProfileOutput)
    @Role(['Any'])
    async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        // UsersService의 findById 메서드를 호출하여 사용자 프로필 조회 로직을 처리합니다.
        return this.usersService.findById(userProfileInput.userId);
    }

    // 사용자 프로필을 편집하는 뮤테이션을 정의합니다.
    // EditProfileInput 타입의 인자를 받아, EditProfileOutput 타입의 결과를 반환합니다.
    @Mutation(returns => EditProfileOutput)
    @Role(['Any'])
    async editProfile(
        @AuthUser() authUser: User, // 현재 인증된 사용자의 정보를 @AuthUser 데코레이터를 통해 받아옵니다.
        @Args('input') editProfileInput: EditProfileInput // 편집할 프로필 정보를 인자로 받습니다.
    ): Promise<EditProfileOutput> {
        // UsersService의 editProfile 메서드를 호출하여 프로필 편집 로직을 처리합니다.
        // 현재 인증된 사용자의 ID와 편집할 프로필 정보를 인자로 전달합니다.
        return this.usersService.editProfile(authUser.id, editProfileInput);
    }

    // @Mutation 데코레이터는 GraphQL 뮤테이션을 정의합니다.
    // 이 뮤테이션은 클라이언트가 서버에 데이터 변경(이 경우, 이메일 인증)을 요청할 때 사용됩니다.
    @Mutation(returns => VerifyEmailOutput)
    verifyEmail(
        // @Args 데코레이터를 사용하여 GraphQL 쿼리에서 'input'이라는 이름의 인자를 받습니다.
        // 이 인자의 타입은 VerifyEmailInput입니다. 구조 분해 할당을 사용하여 입력 객체에서 code를 직접 추출합니다.
        @Args('input') { code }: VerifyEmailInput,
    ): Promise<VerifyEmailOutput> { // 비동기 함수이므로 Promise를 반환합니다. VerifyEmailOutput 타입을 반환하는 Promise입니다.
        // usersService의 verifyEmail 메서드를 호출하고, 입력받은 code를 인자로 전달합니다.
        // 이 메서드는 비동기로 처리되며, 최종적으로 VerifyEmailOutput 타입의 결과를 반환하는 Promise를 반환합니다.
        return this.usersService.verifyEmail(code);
    }
}
