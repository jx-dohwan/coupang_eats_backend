import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { exec } from 'child_process';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';

// 저장소(repository)에 대한 mock(가짜 구현체)을 생성하는 함수를 정의 이 mock들은 jest 함수로 사전 구성
const mockRepository = () => ({
    findOne: jest.fn(),        // 'findOne' 메소드를 모킹 이는 저장소에서 단일 엔트리를 검색하는 데 사용
    save: jest.fn(),           // 'save' 메소드를 모킹 이는 엔트리를 추가하거나 저장소에 업데이트하는 데 사용
    create: jest.fn(),         // 'create' 메소드를 모킹 이는 새 엔티티를 초기화하지만 데이터베이스에는 저장하지 않음
    findOneOrFail: jest.fn(),  // 'findOneOrFail' 메소드를 모킹 이는 'findOne'과 비슷하지만 결과가 없을 경우 오류를 발생
    delete: jest.fn(),         // 'delete' 메소드를 모킹 이는 저장소에서 엔트리를 제거하는 데 사용
});

// JwtService에 대한 mock을 생성하는 함수를 정의 이 또한 jest 함수로 사전 구성
const mockJwtService = () => ({
    sign: jest.fn(() => 'signed-token-baby'), // 'sign' 메소드를 모킹 테스트 목적으로 고정된 토큰을 반환하도록 설정
    verify: jest.fn(),                        // 'verify' 메소드를 모킹 토큰을 검증하는 데 사용
});

// MailService에 대한 mock을 생성하는 함수를 정의 이 메소드도 jest로 사전 구성된 함수를 사용
const mockMailService = () => ({
    sendVerificationEmail: jest.fn(),         // 'sendVerificationEmail' 메소드를 모킹 이메일 인증을 보내는 데 사용
});

// MockRepository 타입을 정의 이는 Repository<T>의 메소드들을 jest.Mock 타입으로 가지는 부분적 기록을 나타냄
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

// UsersService에 대한 단위 테스트를 위한 describe 블록
describe('UsersService', () => {
    let service: UsersService;                // UsersService 타입의 변수를 선언
    let usersRepository: MockRepository<User>;       // User 엔티티에 대한 mock 저장소를 선언
    let verificationsRepository: MockRepository<Verification>;  // Verification 엔티티에 대한 mock 저장소를 선언
    let mailService: MailService;             // MailService 타입의 변수를 선언
    let jwtService: JwtService;               // JwtService 타입의 변수를 선언


    // 각 테스트 케이스를 실행하기 전에 실행할 초기화 코드를 정의
    beforeEach(async () => {
        // Test 모듈을 사용해 테스트 환경을 설정
        // 이 설정은 UsersService와 그 의존성들을 포함
        const module = await Test.createTestingModule({
            providers: [
                UsersService,  // UsersService를 프로바이더 배열에 추가 이 서비스의 인스턴스가 생성되고 의존성이 주입됨
                {
                    provide: getRepositoryToken(User),  // User 엔티티에 대한 저장소 토큰을 제공
                    useValue: mockRepository(),         // mockRepository 함수를 호출하여 User 엔티티의 저장소 모의 객체를 생성하고 주입
                },
                {
                    provide: getRepositoryToken(Verification),  // Verification 엔티티에 대한 저장소 토큰을 제공
                    useValue: mockRepository(),                 // mockRepository 함수를 호출하여 Verification 엔티티의 저장소 모의 객체를 생성하고 주입
                },
                {
                    provide: JwtService,  // JwtService의 토큰을 제공
                    useValue: mockJwtService(),  // mockJwtService 함수를 호출하여 JwtService의 모의 객체를 생성하고 주입
                },
                {
                    provide: MailService,  // MailService의 토큰을 제공
                    useValue: mockMailService(),  // mockMailService 함수를 호출하여 MailService의 모의 객체를 생성하고 주입
                },
            ],
        }).compile();  // 설정된 모듈을 컴파일 이 과정에서 의존성 주입이 완료

        // 컴파일된 모듈에서 UsersService의 인스턴스를 가져옴
        service = module.get<UsersService>(UsersService);
        // 컴파일된 모듈에서 MailService의 인스턴스를 가져옴
        mailService = module.get<MailService>(MailService);
        // 컴파일된 모듈에서 JwtService의 인스턴스를 가져옴
        jwtService = module.get<JwtService>(JwtService);
        // 컴파일된 모듈에서 User 엔티티의 저장소 모의 객체를 가져옴
        usersRepository = module.get(getRepositoryToken(User));
        // 컴파일된 모듈에서 Verification 엔티티의 저장소 모의 객체를 가져옴
        verificationsRepository = module.get(getRepositoryToken(Verification));
    });


    // 'it' 함수는 개별 테스트 케이스를 정의
    it('should be defined', () => {
        // 'expect' 함수는 테스트할 값을 인자로 받음 여기서는 'service' 객체가 테스트 대상
        // 'toBeDefined' 매쳐(matcher)는 해당 객체가 정의되어 있어야 함을 의미 즉, service가 undefined나 null이 아닌 값을 가지고 있어야 함
        expect(service).toBeDefined();
    });


    describe('createAccount', () => {
        // 테스트에 사용될 기본 인자를 설정 이 객체는 함수 호출에 사용
        const createAccountArgs = {
            email: 'test@email.com',
            password: 'test.password',
            role: UserRole.Client,
        }; 

        // "사용자가 이미 존재할 경우 실패해야 한다"는 시나리오를 테스트하는 it 블록
        it('should fail if user exists', async () => {
            // findOne 메소드를 모킹하여, 특정 사용자 객체를 반환하도록 설정
            // 이는 이미 사용자가 데이터베이스에 존재함을 시뮬레이션함
            usersRepository.findOne.mockResolvedValue({
                id: 1,
                email: '',
            });
            // createAccount 함수를 호출하고 결과를 'result' 변수에 저장
            const result = await service.createAccount(createAccountArgs);
            // 함수의 반환값을 검증
            // 결과 객체는 ok 필드가 false이고, error 메시지로 "해당 이메일을 사용하는 사용자가 이미 있습니다."를 포함해야 함
            expect(result).toMatchObject({
                ok: false,
                error: '해당 이메일을 사용하는 사용자가 이미 있습니다.',
            });
        });


        // "새 유저를 생성해야 한다"는 시나리오를 테스트하는 it 블록
        it('should create a new user', async () => {
            // usersRepository의 findOne 메소드를 모킹하여, 어떤 유저도 찾지 못했다는 결과(undefined)를 반환하도록 설정
            usersRepository.findOne.mockResolvedValue(undefined);

            // usersRepository의 create 메소드를 모킹하여, 입력된 인자(createAccountArgs)를 그대로 반환하도록 설정
            usersRepository.create.mockReturnValue(createAccountArgs);

            // usersRepository의 save 메소드를 모킹하여, 입력된 인자(createAccountArgs)를 그대로 반환하도록 설정
            usersRepository.save.mockResolvedValue(createAccountArgs);

            // verificationsRepository의 create 메소드를 모킹하여, createAccountArgs를 user 필드로 사용하는 객체를 반환하도록 설정
            verificationsRepository.create.mockReturnValue({
                user: createAccountArgs,
            });

            // verificationsRepository의 save 메소드를 모킹하여, 'code'라는 문자열 필드를 가진 객체를 반환하도록 설정
            verificationsRepository.save.mockResolvedValue({
                code: 'code',
            });

            // createAccount 메소드를 실행하고 결과를 result 변수에 저장
            const result = await service.createAccount(createAccountArgs);

            // usersRepository.create 메소드가 정확히 한 번 호출되었는지 확인
            expect(usersRepository.create).toHaveBeenCalledTimes(1);
            // create 메소드가 createAccountArgs 인자로 호출되었는지 확인
            expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

            // usersRepository.save 메소드가 정확히 한 번 호출되었는지 확인
            expect(usersRepository.save).toHaveBeenCalledTimes(1);
            // save 메소드가 createAccountArgs 인자로 호출되었는지 확인
            expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

            // verificationsRepository.create 메소드가 정확히 한 번 호출되었는지 확인
            expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
            // create 메소드가 createAccountArgs를 포함하는 객체로 호출되었는지 확인
            expect(verificationsRepository.create).toHaveBeenCalledWith({
                user: createAccountArgs,
            });

            // verificationsRepository.save 메소드가 정확히 한 번 호출되었는지 확인
            expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
            // save 메소드가 createAccountArgs를 포함하는 객체로 호출되었는지 확인
            expect(verificationsRepository.save).toHaveBeenCalledWith({
                user: createAccountArgs,
            });

            // mailService의 sendVerificationEmail 메소드가 정확히 한 번 호출되었는지 확인
            expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
            // sendVerificationEmail 메소드가 문자열 인자 두 개와 함께 호출되었는지 확인(실제 문자열 값은 중요치 않으므로 expect.any(String) 사용).
            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(String),
            );

            // 결과 객체가 { ok: true }와 일치하는지 확인. 이는 성공적으로 계정이 생성되었음을 나타냄
            expect(result).toEqual({ ok: true });
        });

        // "예외가 발생하면 실패해야 한다"는 시나리오를 테스트하는 it 블록
        it('should fail on exception', async () => {
            // usersRepository의 findOne 메소드를 모킹하여, 호출 시 예외를 발생시키도록 설정
            // 이는 데이터베이스 조회 중 오류가 발생하는 상황을 시뮬레이션
            usersRepository.findOne.mockRejectedValue(new Error());

            // createAccount 함수를 실행하고 결과를 result 변수에 저장
            // 예외가 발생하므로, 이 함수는 catch 블록을 실행하여 결과로 오류 메시지를 반환
            const result = await service.createAccount(createAccountArgs);

            // 결과 객체가 { ok: false, error: "계정을 만들 수 없습니다" }와 정확히 일치하는지 검증.
            // 이는 함수가 예외 상황을 적절히 처리하고 사용자에게 이해할 수 있는 오류 메시지를 제공해야 함을 의미
            expect(result).toEqual({ ok: false, error: "계정을 만들 수 없습니다" });
        });

    });

    describe('login', () => {
        // 로그인 함수 호출에 사용될 인자를 정의합니다.
        const loginArgs = {
            email: 'test@email.com',
            password: 'test.password',
        };

        // "사용자가 존재하지 않으면 실패해야 한다"는 시나리오를 테스트하는 it 블록
        it('should fail if user does not exist', async () => {
            // usersRepository의 findOne 메소드를 모킹하여, null을 반환하도록 설정
            // 이는 사용자가 데이터베이스에 존재하지 않음을 의미
            usersRepository.findOne.mockResolvedValue(null);

            // login 함수를 실행하고 결과를 result 변수에 저장
            const result = await service.login(loginArgs);

            // findOne 메소드가 한 번 호출되었는지 확인
            expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
            // findOne 메소드가 객체를 인자로 호출되었는지 확인 (정확한 인자 내용은 검증하지 않음).
            expect(usersRepository.findOne).toHaveBeenCalledWith(expect.any(Object));
            // 결과 객체가 { ok: false, error: '사용자를 찾을 수 없습니다.' }와 일치하는지 검증
            expect(result).toEqual({
                ok: false,
                error: '사용자를 찾을 수 없습니다.',
            });
        });

        // "비밀번호가 틀리면 실패해야 한다"는 시나리오를 테스트하는 it 블록
        it('should fail if the password is wrong', async () => {
            // 사용자의 비밀번호 검증 로직을 실패하도록 설정된 모의 사용자 객체를 생성
            const mockedUser = {
                checkPassword: jest.fn(() => Promise.resolve(false)), // 비밀번호 검증이 항상 실패하도록 설정
            };
            // usersRepository의 findOne 메소드를 모킹하여, 위에서 생성한 모의 사용자 객체를 반환하도록 설정
            usersRepository.findOne.mockResolvedValue(mockedUser);

            // login 함수를 실행하고 결과를 result 변수에 저장
            const result = await service.login(loginArgs);
            // 결과 객체가 { ok: false, error: '잘못된 비밀번호입니다.' }와 일치하는지 검증
            expect(result).toEqual({ ok: false, error: '잘못된 비밀번호입니다.' });
        });

        // "비밀번호가 맞으면 토큰을 반환해야 한다"는 시나리오를 테스트하는 it 블록
        it('should return token if password correct', async () => {
            // 비밀번호 검증이 성공하도록 설정된 모의 사용자 객체를 생성
            const mockedUser = {
                id: 1,
                checkPassword: jest.fn(() => Promise.resolve(true)), // 비밀번호 검증이 항상 성공하도록 설정
            };
            // usersRepository의 findOne 메소드를 모킹하여, 위에서 생성한 모의 사용자 객체를 반환하도록 설정
            usersRepository.findOne.mockResolvedValue(mockedUser);

            // login 함수를 실행하고 결과를 result 변수에 저장
            const result = await service.login(loginArgs);
            // jwtService의 sign 메소드가 한 번 호출되었는지 확인
            expect(jwtService.sign).toHaveBeenCalledTimes(1);
            // sign 메소드가 숫자 타입의 인자(사용자 ID)로 호출되었는지 확인
            expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));
            // 결과 객체가 { ok: true, token: 'signed-token-baby' }와 일치하는지 검증
            expect(result).toEqual({ ok: true, token: 'signed-token-baby' });
        });

        // "예외가 발생하면 실패해야 한다"는 시나리오를 테스트하는 it 블록
        it('should fail on exception', async () => {
            // usersRepository의 findOne 메소드를 모킹하여, 호출 시 예외를 발생시키도록 설정
            usersRepository.findOne.mockRejectedValue(new Error());

            // login 함수를 실행하고 결과를 result 변수에 저장
            const result = await service.login(loginArgs);
            // 결과 객체가 { ok: false, error: "사용자가 로그인할 수 없습니다." }와 일치하는지 검증
            expect(result).toEqual({ ok: false, error: "사용자가 로그인할 수 없습니다." });
        });
    });


    describe('findById', () => {
        const findByIdArgs = {
            id: 1,
        };
        it('should find an existing user', async () => {
            usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
            const result = await service.findById(1);
            expect(result).toEqual({ ok: true, user: findByIdArgs });
        });

        it('should fail if no user is found', async () => {
            usersRepository.findOneOrFail.mockRejectedValue(new Error());
            const result = await service.findById(1);
            expect(result).toEqual({ ok: false, error: '사용자를 찾을 수 없습니다.' });
        });
    });

    describe('findById', () => {
        // 테스트에 사용될 인자를 정의합니다. 이 예에서는 ID만 사용
        const findByIdArgs = {
            id: 1,
        };

        // "기존 사용자를 찾아야 한다"는 시나리오를 테스트하는 it 블록
        it('should find an existing user', async () => {
            // usersRepository의 findOneOrFail 메소드를 모킹하여, findByIdArgs를 반환하도록 설정
            // 이는 해당 ID의 사용자가 데이터베이스에 존재함을 의미
            usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);

            // findById 메소드를 실행하고 결과를 result 변수에 저장
            const result = await service.findById(1);

            // 결과 객체가 { ok: true, user: findByIdArgs }와 일치하는지 검증
            // 이는 함수가 사용자를 성공적으로 찾았음을 나타냄
            expect(result).toEqual({ ok: true, user: findByIdArgs });
        });

        // "사용자를 찾지 못하면 실패해야 한다"는 시나리오를 테스트하는 it 블록
        it('should fail if no user is found', async () => {
            // usersRepository의 findOneOrFail 메소드를 모킹하여, 호출 시 예외를 발생시키도록 설정
            // 이는 해당 ID의 사용자가 데이터베이스에 존재하지 않음을 시뮬레이션
            usersRepository.findOneOrFail.mockRejectedValue(new Error());

            // findById 메소드를 실행하고 결과를 result 변수에 저장
            const result = await service.findById(1);

            // 결과 객체가 { ok: false, error: '사용자를 찾을 수 없습니다.' }와 일치하는지 검증
            // 이는 함수가 사용자를 찾지 못하고 적절한 오류 메시지를 반환함을 나타냄
            expect(result).toEqual({ ok: false, error: '사용자를 찾을 수 없습니다.' });
        });
    });

    describe('verifyEmail', () => {
        // "이메일을 인증해야 한다"는 시나리오를 테스트하는 it 블록
        it('should verify email', async () => {
            // 인증 정보가 포함된 모의 객체를 생성
            const mockedVerification = {
                user: {
                    verified: false,  // 현재 인증되지 않은 상태
                },
                id: 1,  // 모의 인증 객체의 ID
            };
            // verificationsRepository의 findOne 메소드를 모킹하여, 위에서 생성한 모의 객체를 반환하도록 설정
            verificationsRepository.findOne.mockResolvedValue(mockedVerification);

            // verifyEmail 함수를 실행하고 결과를 result 변수에 저장
            const result = await service.verifyEmail('');

            // findOne 메소드가 한 번 호출되었는지 확인
            expect(verificationsRepository.findOne).toHaveBeenCalledTimes(1);
            // findOne 메소드가 객체를 인자로 호출되었는지 확인 (정확한 인자 내용은 검증하지 않습니다).
            expect(verificationsRepository.findOne).toHaveBeenCalledWith(expect.any(Object));
            // usersRepository의 save 메소드가 한 번 호출되었는지 확인
            expect(usersRepository.save).toHaveBeenCalledTimes(1);
            // save 메소드가 { verified: true } 객체를 인자로 호출되었는지 확인
            expect(usersRepository.save).toHaveBeenCalledWith({ verified: true });

            // verificationsRepository의 delete 메소드가 한 번 호출되었는지 확인
            expect(verificationsRepository.delete).toHaveBeenCalledTimes(1);
            // delete 메소드가 모의 인증 객체의 ID를 인자로 호출되었는지 확인
            expect(verificationsRepository.delete).toHaveBeenCalledWith(mockedVerification.id);
            // 결과 객체가 { ok: true }와 일치하는지 검증
            expect(result).toEqual({ ok: true });
        });

        // "인증 정보를 찾지 못하면 실패해야 한다"는 시나리오를 테스트하는 it 블록
        it('should fail on verification not found', async () => {
            // verificationsRepository의 findOne 메소드를 모킹하여, undefined를 반환하도록 설정
            // 이는 인증 정보가 데이터베이스에 존재하지 않음을 시뮬레이션
            verificationsRepository.findOne.mockResolvedValue(undefined);

            // verifyEmail 함수를 실행하고 결과를 result 변수에 저장
            const result = await service.verifyEmail('');
            // 결과 객체가 { ok: false, error: '인증을 찾을 수 없습니다.' }와 일치하는지 검증
            expect(result).toEqual({ ok: false, error: '인증을 찾을 수 없습니다.' });
        });

        // "예외가 발생하면 실패해야 한다"는 시나리오를 테스트하는 it 블록
        it('should fail on exception', async () => {
            // verificationsRepository의 findOne 메소드를 모킹하여, 호출 시 예외를 발생시키도록 설정
            verificationsRepository.findOne.mockRejectedValue(new Error());

            // verifyEmail 함수를 실행하고 결과를 result 변수에 저장
            const result = await service.verifyEmail('');
            // 결과 객체가 { ok: false, error: '이메일을 확인할 수 없습니다.' }와 일치하는지 검증
            expect(result).toEqual({ ok: false, error: '이메일을 확인할 수 없습니다.' });
        });
    });
});