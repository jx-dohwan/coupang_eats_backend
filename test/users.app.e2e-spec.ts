import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Verification } from 'src/users/entities/verification.entity';


// 'got' 라이브러리를 모킹하여, 이 라이브러리의 `post` 함수가 호출될 때 jest.fn() 을 사용하여 모킹 함수를 반환하도록 설정
// 이는 HTTP 요청을 실제로 수행하지 않고 테스트 환경에서 사용할 수 있게 해줌
jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

// GraphQL 요청을 보낼 서버의 엔드포인트를 상수로 선언
const GRAPHQL_ENDPOINT = '/graphql';

// 테스트에 사용될 가상의 사용자 정보를 객체로 선언
const testUser = {
  email: 'test0@test.com',
  password: '12345',
};



describe('AppController (e2e)', () => { // `AppController` 클래스에 대한 End-to-End 테스트를 위한 describe 블록을 시작
  let app: INestApplication; // NestJS 애플리케이션 인스턴스를 담을 변수 선언
  let usersRepository: Repository<User>; // User 엔티티를 위한 Repository 인스턴스를 담을 변수
  let verificationsRepository: Repository<Verification>; // Verification 엔티티를 위한 Repository 인스턴스를 담을 변수
  let jwtToken: string; // 테스트 시 사용할 JWT 토큰을 담을 변수

  // 기본적인 GraphQL 요청을 수행하는 함수를 선언, Supertest 라이브러리를 사용하여 HTTP POST 요청을 수행
  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);

  // 공개적으로 접근 가능한 GraphQL 요청을 수행하는 함수, 주어진 쿼리 문자열로 요청을 구성
  const publicTest = (query: string) => baseTest().send({ query });

  // 인증된 사용자만이 접근 가능한 GraphQL 요청을 수행하는 함수
  // 이 함수는 JWT 토큰을 HTTP 헤더에 포함시켜 요청을 보냄
  const privateTest = (query: string) =>
    baseTest()
      .set('X-JWT', jwtToken)
      .send({ query });


  beforeAll(async () => {  // beforeAll 훅은 모든 테스트가 실행되기 전에 한 번만 호출
    // TestingModule 인터페이스를 사용하여 NestJS 테스트 모듈을 생성
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],  // AppModule을 import, 이는 NestJS 애플리케이션의 모든 기능(컨트롤러, 서비스 등)을 포함
    }).compile(); // 모듈을 컴파일

    // 컴파일된 모듈로부터 NestJS 애플리케이션 인스턴스를 생성
    app = module.createNestApplication();
    // User 엔티티에 대한 Repository 인스턴스를 가져옴, 이는 데이터베이스와의 상호작용을 관리
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    // Verification 엔티티에 대한 Repository 인스턴스를 가져옴
    verificationsRepository = module.get<Repository<Verification>>(
      getRepositoryToken(Verification),
    );
    // 애플리케이션을 초기화, 이는 서버를 시작하는 것과 유사
    await app.init();
  });


  afterAll(async () => { // afterAll 훅은 모든 테스트가 실행된 후에 한 번만 호출
    // DataSource 객체를 생성, 이는 TypeORM의 데이터 소스 연결을 관리
    const dataSource: DataSource = new DataSource({
      type: 'postgres',  // 사용할 DBMS 유형은 PostgreSQL
      host: process.env.DB_HOST,  // 환경 변수에서 DB 호스트 주소
      port: +process.env.DB_PORT,  // 환경 변수에서 DB 포트를 가져옴, 문자열을 숫자로 변환
      username: process.env.DB_USERNAME,  // 환경 변수에서 DB 사용자 이름을 가져옴
      password: process.env.DB_PASSWORD,  // 환경 변수에서 DB 비밀번호를 가져옴
      database: process.env.DB_NAME,  // 환경 변수에서 DB 이름을 가져옴
    });
    const connection: DataSource = await dataSource.initialize();  // 데이터 소스를 초기화
    await connection.dropDatabase();  // 테스트에 사용된 데이터베이스를 삭제
    await connection.destroy();  // 데이터 소스 연결을 종료
    await app.close();  // NestJS 애플리케이션 인스턴스를 종료
  });



  describe('createAccount', () => {
    // 'should create account'라는 테스트 케이스를 정의
    // 이 테스트는 계정 생성이 성공적으로 이루어지는지 확인
    it('should create account', () => {
      return publicTest(`
        mutation {
          createAccount(input: {
            email:"${testUser.email}",
            password:"${testUser.password}",
            role:Owner
          }) {
            ok
            error
          }
        }
        `)
        .expect(200) // HTTP 200 상태 코드를 기대 (성공).
        .expect(res => {
          // 응답 결과를 검사하는 함수
          expect(res.body.data.createAccount.ok).toBe(true); // 'ok' 필드가 true인지 확인
          expect(res.body.data.createAccount.error).toBe(null); // 'error' 필드가 null인지 확인
        });
    });

    // 'should fail if account already exists'라는 테스트 케이스를 정의
    // 이 테스트는 이미 같은 이메일로 계정이 생성되어 있을 경우, 오류 메시지와 함께 실패하는지 확인
    it('should fail if account already exists', () => {
      return publicTest(`
          mutation {
            createAccount(input: {
              email:"${testUser.email}",
              password:"${testUser.password}",
              role:Owner
            }) {
              ok
              error
            }
          }
        `)
        .expect(200) // HTTP 200 상태 코드를 기대 (성공).
        .expect(res => {
          // 응답 결과를 검사하는 함수, 비구조화 할당을 사용하여 필요한 값들을 추출
          const {
            body: {
              data: {
                createAccount: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false); // 'ok' 필드가 false인지 확인 (오류 발생을 기대).
          expect(error).toBe('해당 이메일을 사용하는 사용자가 이미 있습니다.'); // 오류 메시지가 올바른지 확인
        });
    });
  });

  describe('login', () => {
    // 올바른 자격 증명으로 로그인하는 경우를 테스트
    it('should login with correct credentials', () => {
      return publicTest(`
          mutation {
            login(input:{
              email:"${testUser.email}",
              password:"${testUser.password}",
            }) {
              ok
              error
              token
            }
          }
        `)
        .expect(200) // HTTP 200 상태 코드를 기대
        .expect(res => {
          // 응답에서 필요한 데이터를 비구조화 할당으로 추출
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(true); // 로그인 성공 여부를 확인 ('ok' 필드가 true).
          expect(login.error).toBe(null); // 에러 메시지가 없어야 함 ('error' 필드가 null).
          expect(login.token).toEqual(expect.any(String)); // 토큰은 문자열 타입이어야 함
          jwtToken = login.token; // 응답으로 받은 JWT 토큰을 jwtToken 변수에 저장함
        });
    });

    // 잘못된 자격 증명으로 로그인 시도하는 경우를 테스트
    it('should not be able to login with wrong credentials', () => {
      return publicTest(`
          mutation {
            login(input:{
              email:"${testUser.email}",
              password:"xxx",
            }) {
              ok
              error
              token
            }
          }
        `)
        .expect(200) // HTTP 200 상태 코드를 기대
        .expect(res => {
          // 응답에서 필요한 데이터를 비구조화 할당으로 추출
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false); // 로그인 실패 여부를 확인 ('ok' 필드가 false).
          expect(login.error).toBe('잘못된 비밀번호입니다.'); // 올바른 에러 메시지가 반환되어야 함
          expect(login.token).toBe(null); // 실패한 로그인 시도에서는 토큰이 반환되지 않아야 함 ('token' 필드가 null).
        });
    });
  });


  describe('userProfile', () => {
    let userId: number;  // 조회할 사용자의 ID를 저장할 변수

    // 모든 'userProfile' 테스트 전에 한 번만 실행
    beforeAll(async () => {
      const [user] = await usersRepository.find();  // 사용자 저장소에서 첫 번째 사용자를 조회
      userId = user.id;  // 조회된 사용자의 ID를 userId 변수에 저장
    });

    // 올바른 사용자 ID로 프로필을 조회하는 테스트 케이스
    it("should see a user's profile", () => {
      return privateTest(`
        {
          userProfile(userId:${userId}){
            ok
            error
            user {
              id
            }
          }
        }
      `)
        .expect(200) // HTTP 200 상태 코드를 기대
        .expect(res => {
          // 응답 데이터를 비구조화 할당으로 추출
          const {
            body: {
              data: {
                userProfile: {
                  ok,
                  error,
                  user: { id },
                },
              },
            },
          } = res;
          expect(ok).toBe(true); // 프로필 조회 성공 여부 확인 ('ok' 필드가 true)
          expect(error).toBe(null); // 에러가 없어야 함 ('error' 필드가 null)
          expect(id).toBe(userId); // 조회된 사용자 ID가 요청된 사용자 ID와 동일한지 확인
        });
    });

    // 잘못된 사용자 ID로 프로필을 조회하는 테스트 케이스
    it('should not find a profile', () => {
      return privateTest(`
        {
          userProfile(userId:666){
            ok
            error
            user {
              id
            }
          }
        }
      `)
        .expect(200) // HTTP 200 상태 코드를 기대
        .expect(res => {
          // 응답 데이터를 비구조화 할당으로 추출
          const {
            body: {
              data: {
                userProfile: { ok, error, user },
              },
            },
          } = res;
          expect(ok).toBe(false); // 프로필 조회 실패 여부 확인 ('ok' 필드가 false)
          expect(error).toBe('사용자를 찾을 수 없습니다.'); // 적절한 에러 메시지 반환 확인
          expect(user).toBe(null); // 사용자 정보가 없어야 함 ('user' 객체가 null)
        });
    });
  });

  describe('me', () => {
    // 로그인된 사용자로부터 자신의 프로필 정보를 조회하는 테스트 케이스
    it('should find my profile', () => {
      return privateTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200) // HTTP 200 상태 코드를 기대(성공적인 GraphQL 응답).
        .expect(res => {
          // 응답 데이터에서 'email' 필드를 추출
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(testUser.email); // 응답받은 이메일이 테스트 사용자의 이메일과 일치하는지 검증
        });
    });

    // 로그아웃 상태의 사용자가 자신의 프로필 정보를 조회하려 할 때의 테스트 케이스
    it('should not allow logged out user', () => {
      return publicTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200) // HTTP 200 상태 코드를 기대
        .expect(res => {
          // 응답 데이터에서 오류 메시지를 추출합
          const {
            body: { errors },
          } = res;
          const [error] = errors; // 오류 배열에서 첫 번째 오류 객체를 추출
          expect(error.message).toBe('Forbidden resource'); // 오류 메시지가 "Forbidden resource"인지 검증
          // 이 메시지는 로그아웃 상태에서 'me' 쿼리를 사용할 수 없음을 나타냄
        });
    });
  });

  describe('editProfile', () => {
    const NEW_EMAIL = 'nico@new.com'; // 테스트에 사용할 새 이메일 주소를 상수로 선언

    // 사용자의 이메일을 변경하는 기능을 테스트
    it('should change email', () => {
      return privateTest(`
            mutation {
              editProfile(input:{
                email: "${NEW_EMAIL}"
              }) {
                ok
                error
              }
            }
        `)
        .expect(200) // HTTP 200 상태 코드를 기대 (성공적인 GraphQL 응답).
        .expect(res => {
          // 응답 데이터를 비구조화 할당으로 추출
          const {
            body: {
              data: {
                editProfile: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true); // 이메일 변경 요청이 성공적이었는지 확인 ('ok' 필드가 true).
          expect(error).toBe(null); // 에러가 없어야 함 ('error' 필드가 null).
        });
    });

    // 변경된 이메일이 실제로 적용되었는지 검증하는 테스트 케이스
    it('should have new email', () => {
      return privateTest(`
          {
            me {
              email
            }
          }
        `)
        .expect(200) // HTTP 200 상태 코드를 기대
        .expect(res => {
          // 응답 데이터에서 'email' 필드를 추출
          const {
            body: {
              data: {
                me: { email },
              },
            },
          } = res;
          expect(email).toBe(NEW_EMAIL); // 응답받은 이메일이 변경된 이메일 주소(NEW_EMAIL)와 일치하는지 검증
        });
    });
  });

  describe('verifyEmail', () => {
    let verificationCode: string;  // 이메일 인증에 사용될 코드를 저장할 변수

    // 모든 'verifyEmail' 테스트 전에 한 번만 실행
    beforeAll(async () => {
      const [verification] = await verificationsRepository.find();  // 인증 리포지토리에서 첫 번째 인증 정보를 조회
      verificationCode = verification.code;  // 조회된 인증 정보에서 인증 코드를 추출
    });

    // 유효한 인증 코드로 이메일 인증을 시도하는 테스트 케이스
    it('should verify email', () => {
      return publicTest(`
            mutation {
              verifyEmail(input:{
                code:"${verificationCode}"
              }){
                ok
                error
              }
            }
        `)
        .expect(200) // HTTP 200 상태 코드를 기대 (성공적인 GraphQL 응답).
        .expect(res => {
          // 응답 데이터를 비구조화 할당으로 추출
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(true); // 이메일 인증 요청이 성공적이었는지 확인 ('ok' 필드가 true).
          expect(error).toBe(null); // 에러가 없어야 함 ('error' 필드가 null).
        });
    });

    // 유효하지 않은 인증 코드로 이메일 인증을 시도하는 테스트 케이스
    it('should fail on verification code not found', () => {
      return publicTest(`
            mutation {
              verifyEmail(input:{
                code:"xxxxx"
              }){
                ok
                error
              }
            }
        `)
        .expect(200) // HTTP 200 상태 코드를 기대
        .expect(res => {
          // 응답 데이터를 비구조화 할당으로 추출
          const {
            body: {
              data: {
                verifyEmail: { ok, error },
              },
            },
          } = res;
          expect(ok).toBe(false); // 인증 코드가 유효하지 않아 인증 실패해야 함 ('ok' 필드가 false).
          expect(error).toBe('인증을 찾을 수 없습니다.'); // 적절한 에러 메시지 반환 확인 ('error' 필드에 오류 메시지가 포함되어야 함).
        });
    });
  });

});