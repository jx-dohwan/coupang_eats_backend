import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";

@InputType()
export class DeleteReviewInput {
    @Field(type => Int)
    reviewId: number;
}

@ObjectType()
export class DeleteReviewOutput extends CoreOutput { }