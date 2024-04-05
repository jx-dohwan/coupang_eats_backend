import { v4 as uuidv4 } from 'uuid';
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from './user.entity';

@InputType({ isAbstract: true }) // GraphQL의 입력 타입 정의 , 해당 옵션은 입력 타입을 직접 사용하지 않고, 다른 입력 타입을 상속하는 데 사용
@ObjectType() // GraphQL의 객체 타입을 정의
@Entity() // 이 클래스가 TypeORM의 엔티티임을 나타냄
export class Verification extends CoreEntity {
    @Column() // 데이터베이스 컬럼을 정의
    @Field(type => String) // GraphQL 스키마에서 이 필드를 사용할 수 있게 함
    code: string;

    @OneToOne(type => User, { onDelete: 'CASCADE' }) // user과 1:1의 관계를 가진다. user 엔티티가 삭제될경우 verification 엔티티도 함께 삭제
    @JoinColumn() // 외래 키 컬럼을 이 엔티티 측에 위치시킨다.
    user: User;

    @BeforeInsert() // 엔티니가 데이터베이스에 삽입되기 전에 실행될 메서드를 정의한다.
    createCode(): void {
        this.code = uuidv4(); //랜덤값으로 code 필드에 할당한다.
    }
}