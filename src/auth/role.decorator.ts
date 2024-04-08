import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

// AllowedRoles 타입을 정의한다. 이 타입은 UserRole 열거형의 모든 키 또는 'Any' 문자열 중 하나이다.
// 'Any'는 모든 사용자 역할을 허용한다는 의미로 사용된다.
export type AllowedRoles = keyof typeof UserRole | 'Any';

// Role 함수를 정의하고 export한다. 이 함수는 roles 배열을 인자로 받다
// 'roles'라는 키와 해당 배열 메타데이터로 설정하는 데코레이터를 반환한다.
// SetMetadata는 데코레이터 내부에서 메타데이터를 설정할 수 있다. 이 메타데이터는 나중에 guards에서 실행 컨텍스트에 접근하여 검증 로직에 활용된다.
// Role 커스텀 데코레이터는 특정 역할을 메타데이터로 설정하는 방법을 단순화한다.
export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);