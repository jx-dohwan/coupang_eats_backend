import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity } from "typeorm";
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from "@nestjs/common";

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

    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            const ok = await bcrypt.compare(aPassword, this.password);
            return ok;

        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}