import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { Reviews } from "../entities/reviews.entity";
import { CoreOutput } from "src/common/dtos/output.dto";

@InputType()
export class CreateReviewInput extends PickType(Reviews, [
    'score',
    'reviewText',
    'reviewImg',
]) {
    @Field(type => Int)
    restaurantId: number;

    @Field(type => Int)
    clientId: number
}

@ObjectType()
export class CreateReviewOutput extends CoreOutput {

}