import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Restaurant } from "../entities/restaurant.entity";
import { Dish } from "../entities/dish.entity";

@InputType()
export class MenuInput {
    @Field(type => Int)
    menuId: number;
}

@ObjectType()
export class MenuOutput extends CoreOutput {
    @Field(type => Dish, { nullable: true })
    menu?: Dish;
}