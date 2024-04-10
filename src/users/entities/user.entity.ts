import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from "@nestjs/common";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { Order } from "src/orders/entities/order.entity";

export enum UserRole {
    Client = 'Client', // 고객
    Owner = 'Owner', // 주인
    Delivery = 'Delivery', // 배달

}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Column({ unique: true })
    @Field(type => String)
    @IsEmail()
    email: string;

    @Column({ select: false })
    @Field(type => String)
    @IsString()
    password: string;

    @Column({ type: 'enum', enum: UserRole })
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;

    @Column({ default: false })
    @Field(type => Boolean)
    @IsBoolean()
    verified: boolean;


    @Field(type => [Restaurant])
    @OneToMany(
        type => Restaurant,
        restaurant => restaurant.owner,
    )
    restaurants: Restaurant[]

    @Field(type => [Order])
    @OneToMany(
        type => Order,
        order => order.customer,
    )
    orders: Order[];

    @Field(type => [Order])
    @OneToMany(
        type => Order,
        order => order.driver,
    )
    rides: Order[];


    @BeforeInsert() // 엔티티가 데이터베이스에 삽입되기 전에 자동으로 실행되도록 한다.
    @BeforeUpdate() // 엔티니가 데이터베이스에 업데이트 되기 전에 자동으로 실행되도록 한다.
    async hashPassword(): Promise<void> {
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10); // 비밀번호를 해시한다. 첫번째 인자는 해시할 비밀번호이며, 두번째 인자는 해시의 복잡성 결정한다. 라운드수가 높으면 처리 시간이 길어진다.
            } catch (e) {
                // 해시과정에서 오류가 발생한 경우 콘솔에 오류를 기록하고, 내부 서버 오류 예외를 던진다.
                console.log(e);
                throw new InternalServerErrorException();
            }
        }
    }

    // 제공된 비밀번호가 저장된 비밀번호와 일치하는지 검증
    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            const ok = await bcrypt.compare(aPassword, this.password); // 데이터베이스에 저장된 해시 비밀번호와 사용자가 입력한 비밀번호(aPassword)를 비교
            return ok;

        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}