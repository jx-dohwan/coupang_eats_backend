import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ObjectType()
export class EditProfileOutput extends CoreOutput { }

@InputType()
export class EditProfileInput extends PartialType( 
    // PartialType을 사용하여 모든 필드를 선택적(optional)으로 만든다. 즉, 사용자는 email, password중 하나 또는 둘 다를 선택적으로 제공할 수 있다.
    // 이는 자신의 프로필에서 일부 정보만 수정하고 싶을 때 유용하다.
    PickType(User, ['email', 'password']),
) { }