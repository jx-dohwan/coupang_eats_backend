import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Verification } from "../entities/verification.entity";

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}

@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code']) {  // PickType 함수는 기존 타입에서 특정 필드만 선택하여 새로운 입력 타입을 생성합니다.

}