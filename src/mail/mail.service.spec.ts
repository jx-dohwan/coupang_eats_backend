import { Test } from '@nestjs/testing';
import fetch from 'node-fetch';
import * as FormData from 'form-data';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';
import got from 'got';

// 'got'와 'form-data' 라이브러리를 jest를 이용해 모킹 
// 이는 네트워크 요청을 직접 수행하지 않고 가짜 함수를 이용하여 테스트할 수 있게 함
jest.mock('got');
jest.mock('form-data');

// 테스트에 사용될 메일 서비스의 도메인을 상수로 선언
const TEST_DOMAIN = 'test-domain';

// 'MailService' 클래스의 기능을 테스트하는 유닛 테스트 블록을 정의
describe('MailService', () => {
  let service: MailService;  // 'MailService' 타입의 변수를 선언하여, 테스트 중 서비스 인스턴스를 관리

  // 각 테스트 실행 전에 실행되는 설정 블록
  // 이 블록은 'MailService'가 필요로 하는 의존성을 주입하고, 서비스 인스턴스를 생성
  beforeEach(async () => {
    // NestJS의 테스팅 모듈을 사용하여 모듈을 동적으로 생성 
    // 이 모듈에는 테스트할 서비스와 필요한 구성 옵션들이 포함
    const module = await Test.createTestingModule({
      providers: [
        MailService,  // 테스트할 'MailService'를 프로바이더로 등록
        {
          provide: CONFIG_OPTIONS,  // 'CONFIG_OPTIONS'는 'MailService'가 필요로 하는 구성 옵션들을 제공하는 토큰
          useValue: {  // 실제 구성 옵션의 값을 명시
            apiKey: 'test-apiKey',  // API 키
            domain: TEST_DOMAIN,  // 사용할 도메인
            fromEmail: 'test-fromEmail',  // 발신자 이메일 주소
          },
        },
      ],
    }).compile();  // 설정한 모듈을 컴파일

    // 컴파일된 모듈에서 'MailService' 인스턴스를 가져옴
    service = module.get<MailService>(MailService);
  });

  // 'MailService' 인스턴스가 성공적으로 정의되었는지 테스트
  it('should be defined', () => {
    expect(service).toBeDefined();  // 'service' 변수가 정의되어 있어야 함
  });

  // 'sendVerificationEmail' 메소드를 테스트하는 describe 블록
  describe('sendVerificationEmail', () => {
    // 'sendVerificationEmail'가 'sendEmail'를 호출하는지 테스트하는 it 블록
    it('should call sendEmail', () => {
      // 호출할 때 사용될 인자를 객체로 정의
      const sendVerificationEmailArgs = {
        email: 'email',
        code: 'code',
      };

      // 'sendEmail' 메소드를 감시하고, 호출되면 true를 반환하도록 모킹
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => true);

      // 'sendVerificationEmail' 메소드 실행
      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );

      // 'sendEmail'가 정확히 한 번 호출되었는지 확인
      expect(service.sendEmail).toHaveBeenCalledTimes(1);

      // 'sendEmail'가 정확한 인자들로 호출되었는지 확인
      expect(service.sendEmail).toHaveBeenCalledWith(
        'jx7789@gmail.com',  // 이메일 주소
        'coupang eats email verification',  // 이메일 제목
        [
          { key: 'code', value: sendVerificationEmailArgs.code },  // 이메일 본문에서 사용될 코드
          { key: 'username', value: sendVerificationEmailArgs.email },  // 사용자 이름 (이메일 주소)
        ],
      );
    });
  });

  // 'sendEmail' 메소드를 테스트하는 describe 블록
  describe('sendEmail', () => {
    // 'sendEmail' 메소드가 이메일을 성공적으로 보내는지 테스트하는 it 블록
    it('sends email', async () => {
      // 'sendEmail' 메소드 호출 및 반환값 저장
      const ok = await service.sendEmail('', '', []);

      // 'FormData'의 'append' 메소드가 호출되었는지 감시
      const formSpy = jest.spyOn(FormData.prototype, 'append');

      // 'append' 메소드가 호출되었는지 확인
      expect(formSpy).toHaveBeenCalled();

      // 'got.post'가 정확히 한 번 호출되었는지 확인
      expect(got.post).toHaveBeenCalledTimes(1);

      // 'got.post'가 올바른 URL과 객체로 호출되었는지 확인
      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,  // API URL
        expect.any(Object),  // 호출시 사용된 설정 객체
      );

      // 이메일 전송 성공 여부 (true) 확인
      expect(ok).toEqual(true);
    });

    // 'sendEmail' 메소드가 에러를 만났을 때 적절히 처리하는지 테스트하는 it 블록
    it('fails on error', async () => {
      // 'got.post'를 모킹하여 에러를 발생시키도록 설정
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });

      // 'sendEmail' 메소드 호출 및 반환값 저장
      const ok = await service.sendEmail('', '', []);

      // 이메일 전송 실패 여부 (false) 확인
      expect(ok).toEqual(false);
    });
  });

});