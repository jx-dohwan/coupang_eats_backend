import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString, Length, Max, Min, ValidateNested } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Restaurant } from "./restaurant.entity";
import { User } from "src/users/entities/user.entity";
import { Type } from "class-transformer";

@InputType('reviewImgInputType', {isAbstract:true})
@ObjectType()
export class ReviewImges {
    @Field(type => String)
    @Column()
    @IsString()
    url: string;
}

@InputType('ReviewsInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Reviews extends CoreEntity {
    @Field(type => Int)
    @Column()
    @IsNumber()
    @Min(1) // 숫자는 이걸로 길이를 제한한다.
    @Max(5)
    score?: number;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    @IsString()
    @Length(1, 300)
    reviewText?: string;

    @Field(type => [ReviewImges], { nullable: true })
    @Column({type: 'json',  nullable: true })
    @ValidateNested({ each: true }) // 이건뭐지?
    @Type(() => ReviewImges) // 이건 뭐지?
    reviewImg?: ReviewImges[];

    @Field(type => [Restaurant])
    @ManyToOne(
        type => Restaurant,
        restaurant => restaurant.reviews,
        { onDelete: 'SET NULL', nullable: true,} // 리뷰 삭제 시 식당 참조를 NULL로
    )
    restaurant?: Restaurant;

    @RelationId((review: Reviews) => review.restaurant)
    restaurantId: number;

    @Field(type => [User])
    @ManyToOne(
        type => User,
        user => user.reviews,
        { onDelete: 'SET NULL', nullable: true, }
    )
    client?: User;

    @RelationId((review: Reviews) => review.client)
    clientId: number;


}