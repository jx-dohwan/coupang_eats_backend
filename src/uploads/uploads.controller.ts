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
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, cb) => {
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
            cb(null, true);
        },
    }))
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
            // const objectName = `${Date.now() + file.originalname}`;
            // 1. 원본 파일명에서 확장자를 추출합니다.
            const ext = file.originalname.split('.').pop();
            
            // 2. 파일명에서 한글, 공백, 특수문자를 제거하고 안전한 문자로만 대체합니다.
            const baseName = file.originalname
              .substring(0, file.originalname.lastIndexOf('.')) // 확장자 제외
              .replace(/[^a-zA-Z0-9]/g, ''); // 영문, 숫자 외 모든 문자 제거
              
            // 3. 타임스탬프와 정제된 파일명을 결합하여 고유한 Key를 생성합니다.
            const objectName = `${Date.now()}_${baseName}.${ext}`;
            
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
