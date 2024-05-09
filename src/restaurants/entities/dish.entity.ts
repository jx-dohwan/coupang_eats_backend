import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Restaurant } from "./restaurant.entity";

@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
    @Field(type => String)
    name: string;

    @Field(type => Int, { nullable: true })
    extra?: number;
}

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
    @Field(type => String)
    name: string;

    @Field(type => [DishChoice], { nullable: true })
    choices?: DishChoice[];

    @Field(type => Int, { nullable: true })
    extra?: number;
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    @Length(1, 100)
    name: string;

    @Field(type => Int)
    @Column()
    @IsNumber()
    price: number;

    @Field(type => String, )
    @Column()
    @IsString()
    photo: string;

    @Field(type => String)
    @Column()
    @Length(1, 140)
    description: string;

    @Field(type => Restaurant)
    @ManyToOne(
        type => Restaurant,              
        restaurant => restaurant.menu,   // "Many" 측: Restaurant 엔티티 내의 menu 속성은 "Many" 측을 나타냅니다.여기서 Menu 엔티티는 Many 측에 위치하며, 각 Menu 엔티티는 하나의 Restaurant 엔티티에 연결됩니다(이 코드에서는 restaurant 필드로 연결).
        { onDelete: 'CASCADE' },         // onDelete 옵션: Restaurant이 삭제될 경우 연관된 Menu 엔티티들도 함께 삭제됩니다(CASCADE).
    )
    restaurant: Restaurant;             // 이 필드는 Restaurant 엔티티를 참조합니다. 현재 Menu 엔티티에서 보면, 여러 Menu 엔티티가 같은 Restaurant 엔티티를 참조할 수 있습니다.
    
    @RelationId((dish: Dish) => dish.restaurant)
    restaurantId: number;

    @Field(type => [DishOption], { nullable: true })
    @Column({ type: 'json', nullable: true })
    options?: DishOption[]
}