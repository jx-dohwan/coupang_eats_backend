import { Field, InputType, Int, ObjectType, PartialType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Reviews } from "../entities/reviews.entity";


@InputType()
export class EditReviewInput extends PickType(PartialType(Reviews), [
    'score',
    'reviewText',
    'reviewImg',
]) {
    @Field(type => Int)
    reviewId: number;
}


@ObjectType()
export class EditReviewOutput extends CoreOutput { }