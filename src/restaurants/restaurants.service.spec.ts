import { Test } from "@nestjs/testing";
import { RestaurantService } from "./restaurants.service";
import { Repository } from "typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Category } from "./entities/category.entity";
import { Dish } from "./entities/dish.entity";
import { Reviews } from "./entities/reviews.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CategoryRepository } from "./repositories/category.repository";
import { User, UserRole } from "src/users/entities/user.entity";


const mockRepository = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
});

const mockCategoryRepository = () => ({
    getOrCreate: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>> & {
    getOrCreate: jest.Mock;
};


describe('RestaurantService', () => {
    let service: RestaurantService;
    let restaurantRepository: MockRepository<Restaurant>;
    // let categoryRepository: MockRepository<Category>;
    let categoryRepository: CategoryRepository
    let dishRepository: MockRepository<Dish>;
    let reviewRepository: MockRepository<Reviews>;
    let user: User;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RestaurantService,
                {
                    provide: getRepositoryToken(Restaurant),
                    useValue: mockRepository(),
                },
                {
                    provide: CategoryRepository,
                    useValue: mockCategoryRepository(),
                },
                {
                    provide: getRepositoryToken(Dish),
                    useValue: mockRepository(),
                },
                {
                    provide: getRepositoryToken(Reviews),
                    useValue: mockRepository(),
                },
            ],
        }).compile();

        service = module.get<RestaurantService>(RestaurantService);
        restaurantRepository = module.get(getRepositoryToken(Restaurant));
        categoryRepository = module.get(CategoryRepository);
        dishRepository = module.get(getRepositoryToken(Dish));
        reviewRepository = module.get(getRepositoryToken(Reviews));
        user = new User();
        user.id = 1;
        user.email = 'test1@test.com';
        user.password = '12345';
        user.role = UserRole.Owner;
        user.verified = true;
        user.restaurants = [];
        user.orders = [];
        user.rides = [];
        user.payments = [];
        user.reviews = [];
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createRestaurant', () => {
        const createRestaurantInput = {
            name: '이름모를식당',
            address: '버뮤다삼각지대',
            coverImg: '',
            categoryName: '소속없음'
        };

        it('should fail if restaurant exists', async () => {
            restaurantRepository.findOne.mockResolvedValue({
                id: 1,
                name: '이름모를식당',
                owner: user
            });

            const result = await service.createRestaurant(user, createRestaurantInput);

            expect(result).toMatchObject({
                ok: false,
                error: '식당을 만들 수 없습니다.'
            });

        });


        it('should create a new restaurant', async () => {
            // restaurantRepository.findOne.mockResolvedValue(undefined);
            restaurantRepository.create.mockReturnValue(createRestaurantInput);
            // categoryRepository.getOrCreate.mockResolvedValue(expect.any(String));
            restaurantRepository.save.mockResolvedValue(createRestaurantInput);

            const result = await service.createRestaurant(user, createRestaurantInput);

            // expect(restaurantRepository.findOne).toHaveBeenCalledTimes(1);
            // expect(restaurantRepository.findOne).toHaveBeenCalledWith(result);
            expect(restaurantRepository.create).toHaveBeenCalledTimes(1);
            expect(restaurantRepository.create).toHaveBeenCalledWith(createRestaurantInput);
            expect(categoryRepository.getOrCreate).toHaveBeenCalledWith(
                expect.any(String),
            )

            expect(restaurantRepository.save).toHaveBeenCalled();
            expect(result).toEqual({ ok: true, restaurantId: undefined });
        });




    });
});




/* ----------------------- 이 부분은 아직 보류중 ---------------------------------
describe('RestaurantService', () => {
    let service: RestaurantService;
    let restaurantRepository: MockRepository<Restaurant>;
    let categoryRepository: CategoryRepository;
    let dishRepository: MockRepository<Dish>;
    let reviewRepository: MockRepository<Reviews>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RestaurantService,
                {
                    provide: getRepositoryToken(Restaurant),
                    useValue: mockRepository(),
                },
                {
                    provide: CategoryRepository,
                    useValue: mockCategoryRepository(),
                },
                {
                    provide: getRepositoryToken(Dish),
                    useValue: mockRepository(),
                },
                {
                    provide: getRepositoryToken(Reviews),
                    useValue: mockRepository(),
                },
            ],
        }).compile();

        service = module.get<RestaurantService>(RestaurantService);
        restaurantRepository = module.get(getRepositoryToken(Restaurant));
        categoryRepository = module.get<CategoryRepository>(CategoryRepository);
        dishRepository = module.get(getRepositoryToken(Dish));
        reviewRepository = module.get(getRepositoryToken(Reviews))

    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createRestaurant', () => {
        const createRestaurantOwner = {
            id: 1,
            email: 'test1@test.com',
            password: '12345',
            role: UserRole.Owner,
            verified: true,
            restaurants: [],
            orders: [],
            rides: [],
            payments: [],
            reviews: [],
        };

        const createRestaurantInput = {
            name: '이름모를식당',
            address: '버뮤다삼각지대',
            coverImg: '',
            categoryName: '소속없음'
        };

        it('should fail if restaurant exists', async () => {
       
            const result = await service.createRestaurant(createRestaurantOwner, createRestaurantInput);

            expect(result).toEqual({
                ok: false,
                error: 'Restaurant already exists.'
            });
            expect(restaurantsRepository.findOne).toHaveBeenCalledWith({
                where: { name: "Test Restaurant", owner: mockUser.id }
            });
        });
    });
    it.todo('myRestaurants');
    it.todo('myRestaurant');
    it.todo('editRestaurant');
    it.todo('deleteRestaurant');
    it.todo('allRestaurants');
    it.todo('findRestaurantById');
    it.todo('searchRestaurantByName');
    it.todo('allCategories');
    it.todo('findCategoryBySlug');
    it.todo('createDish');
    it.todo('editDish');
    it.todo('deleteDish');
    it.todo('createReview');
    it.todo('editReview');
    it.todo('deleteReview');
});*/