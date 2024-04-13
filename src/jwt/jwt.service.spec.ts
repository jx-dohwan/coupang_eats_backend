import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from './jwt.service';

// jsonwebtoken 모듈을 모킹 sign과 verify 함수를 가짜 구현으로 설정
jest.mock('jsonwebtoken', () => {
    return {
      sign: jest.fn(() => 'TOKEN'),  // sign 함수는 'TOKEN' 문자열을 반환하는 가짜 함수로 설정
      verify: jest.fn(() => ({ id: USER_ID })) // verify 함수는 { id: USER_ID } 객체를 반환하는 가짜 함수로 설정
    };
  });
  
  const TEST_KEY = 'testKey';  // 테스트에 사용될 비밀 키를 상수로 선언
  const USER_ID = 1;  // 테스트에 사용될 사용자 ID를 상수로 선언
  
  // JwtService의 기능을 테스트하는 describe 블록
  describe('JwtService', () => {
    let service: JwtService;  // JwtService 타입의 변수를 선언
  
    // 각 테스트가 실행되기 전에 한 번씩 실행되는 beforeEach 블록
    beforeEach(async () => {
      const module = await Test.createTestingModule({
        providers: [
          JwtService,  // JwtService를 프로바이더로 추가
          {
            provide: CONFIG_OPTIONS,  // CONFIG_OPTIONS를 토큰으로 사용
            useValue: { privateKey: TEST_KEY },  // 테스트 키를 사용하는 설정 객체를 제공
          },
        ],
      }).compile();  // 모듈을 컴파일
  
      service = module.get<JwtService>(JwtService);  // 컴파일된 모듈에서 JwtService 인스턴스를 가져옴
    });
  
    // JwtService가 정의되어 있는지 테스트
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    // 'sign' 함수 기능을 테스트하는 describe 블록
    describe('sign', () => {
      it('should return a signed token', () => {
        const token = service.sign(USER_ID);  // USER_ID를 사용하여 토큰을 생성
        expect(typeof token).toBe('string');  // 반환된 토큰이 문자열 타입인지 확인
        expect(jwt.sign).toHaveBeenCalledTimes(1);  // sign 함수가 정확히 한 번 호출되었는지 확인
        expect(jwt.sign).toHaveBeenLastCalledWith({ id: USER_ID }, TEST_KEY);  // sign 함수 호출시 사용된 인자들을 확인
      });
    });
  
    // 'verify' 함수 기능을 테스트하는 describe 블록
    describe('verify', () => {
      it('should return the decoded token', () => {
        const TOKEN = "TOKEN";  // 테스트에 사용될 가짜 토큰 값을 상수로 선언
        const decodedToken = service.verify(TOKEN);  // TOKEN을 사용하여 토큰을 디코드
        expect(decodedToken).toEqual({ id: USER_ID });  // 디코드된 결과가 예상과 일치하는지 확인
        expect(jwt.verify).toHaveBeenCalledTimes(1);  // verify 함수가 정확히 한 번 호출되었는지 확인
        expect(jwt.verify).toHaveBeenCalledWith(TOKEN, TEST_KEY);  // verify 함수 호출시 사용된 인자들을 확인
      });
    });
  });