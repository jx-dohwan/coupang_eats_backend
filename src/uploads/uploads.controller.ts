import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'jgimagebucketox';
// 이름에 대문자가 들어가면 안됨/이것때매 시간 날림/사이트에서 직접 버킷 만들려하다 보니 알게된 규칙임

@Controller('uploads')
export class UploadsController {
    @Post('')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file) {
        AWS.config.update({
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },

        });
        try {
            // AWS.config.update({ region: 'ap-northeast-2' }); 한국 서버

            // const upload = await new AWS.S3() 버킷 만들
            //     .createBucket({ Bucket: BUCKET_NAME })
            //     .promise();
            const objectName = `${Date.now() + file.originalname}`;
            await new AWS.S3()
                .putObject({
                    Body: file.buffer,
                    Bucket: BUCKET_NAME,
                    Key: objectName,
                    ACL: "public-read", // 버킷에서 ACL 활성화 해야함
                })
                .promise();
            const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
            return { url };
        } catch (error) {
            return null;
        }
    }
}
