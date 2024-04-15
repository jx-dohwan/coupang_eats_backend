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
import { MyRestaurantInput } from "./dtos/my-restaurant.dto";
import { EditRestaurantInput } from "./dtos/edit-restaurant.dto";


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


        it('should create a new restaurant', async () => { // 조금 애매하긴 함
            restaurantRepository.create.mockReturnValue(createRestaurantInput);
            restaurantRepository.save.mockResolvedValue(createRestaurantInput);

            const result = await service.createRestaurant(user, createRestaurantInput);

            expect(restaurantRepository.create).toHaveBeenCalledTimes(1);
            expect(restaurantRepository.create).toHaveBeenCalledWith(createRestaurantInput);
            expect(categoryRepository.getOrCreate).toHaveBeenCalledWith(
                expect.any(String),
            )

            expect(restaurantRepository.save).toHaveBeenCalled();
            expect(result).toEqual({ ok: true, restaurantId: undefined });
        });

        it('should fail on exception', async () => {
            restaurantRepository.create.mockImplementation(() => { throw new Error(); }); // correct way to simulate an error occurring during the function execution
            restaurantRepository.save.mockImplementation(() => { throw new Error(); }); // correct way to simulate an error occurring during the function execution

            const result = await service.createRestaurant(user, createRestaurantInput);

            expect(result).toEqual({ ok: false, error: '식당을 만들 수 없습니다.' });
        });

    });

    describe('myRestaurants', () => {
        it('should return empty if no My Restaurants exist', async () => {
            restaurantRepository.find.mockResolvedValue([]);

            const result = await service.myRestaurants(user);

            expect(restaurantRepository.find).toHaveBeenCalledTimes(1);
            expect(restaurantRepository.find).toHaveBeenCalledWith({
                where: { owner: { id: user.id } }
            });
            expect(result).toEqual({
                ok: true,
                restaurants: []
            });
        });

        it('should find all My Restaurants', async () => {
            const restaurantResult = [
                {
                    id: 1,
                },
                {
                    id: 2,
                }
            ];
            restaurantRepository.find.mockResolvedValue(restaurantResult);

            const result = await service.myRestaurants(user);

            expect(restaurantRepository.find).toHaveBeenCalledTimes(1);
            expect(restaurantRepository.find).toHaveBeenCalledWith({
                where: { owner: { id: user.id } }
            });
            expect(result).toEqual({
                ok: true,
                restaurants: restaurantResult
            });
        });

        it('should fail on exception', async () => {
            const errorMessage = "Database error";
            restaurantRepository.find.mockRejectedValue(new Error(errorMessage));

            const result = await service.myRestaurants(user);

            expect(restaurantRepository.find).toHaveBeenCalledTimes(1);
            expect(restaurantRepository.find).toHaveBeenCalledWith({
                where: { owner: { id: user.id } }
            });
            expect(result).toEqual({
                ok: false,
                error: "식당을 찾을 수 없습니다."
            });
        });
    });

    describe('myRestaurant', () => {
        let myRestaurantInput: MyRestaurantInput;

        beforeEach(() => {
            myRestaurantInput = { id: 1 };
        });

        it('should return empty if no My Restaurant exist', async () => {
            restaurantRepository.findOne.mockResolvedValue(null);

            const result = await service.myRestaurant(user, myRestaurantInput);

            expect(restaurantRepository.findOne).toHaveBeenCalledTimes(1);
            expect(restaurantRepository.findOne).toHaveBeenCalledWith({
                where: { owner: { id: user.id }, id: myRestaurantInput.id },
                relations: ['menu', 'orders'],
            });
            expect(result).toEqual({
                ok: true,
                restaurant: null
            });
        });

        it('should find My Restaurant', async () => {
            const restaurantResult = {
                id: 1,

            };
            restaurantRepository.findOne.mockResolvedValue(restaurantResult);

            const result = await service.myRestaurant(user, myRestaurantInput);

            expect(restaurantRepository.findOne).toHaveBeenCalledTimes(1);
            expect(restaurantRepository.findOne).toHaveBeenCalledWith({
                where: { owner: { id: user.id }, id: myRestaurantInput.id },
                relations: ['menu', 'orders'],
            });
            expect(result).toEqual({
                ok: true,
                restaurant: restaurantResult
            });
        });

        it('should fail on exception', async () => {
            const errorMessage = "Database error";
            restaurantRepository.findOne.mockRejectedValue(new Error(errorMessage));

            const result = await service.myRestaurant(user, myRestaurantInput);

            expect(restaurantRepository.findOne).toHaveBeenCalledTimes(1);
            expect(restaurantRepository.findOne).toHaveBeenCalledWith({
                where: { owner: { id: user.id }, id: myRestaurantInput.id },
                relations: ['menu', 'orders'],
            });
            expect(result).toEqual({
                ok: false,
                error: "식당을 찾을 수 없습니다."
            });
        });
    });

    describe('editRestaurant', () => {
        let editRestaurantInput: EditRestaurantInput;
        let restaurant: Restaurant;

        beforeEach(() => {
            editRestaurantInput = {
                restaurantId: 1,
                name: 'Updated Name',
                address: 'Updated Address',
                coverImg: 'http://example.com/updated_img.png',
                categoryName: 'Updated Category'
            };


        });
        it('should fail if restaurant does not exist', async () => {
            restaurantRepository.findOne.mockResolvedValue(null);  // Simulate not finding the restaurant

            const result = await service.editRestaurant(user, editRestaurantInput);

            expect(restaurantRepository.findOne).toHaveBeenCalledTimes(1);
            expect(restaurantRepository.findOne).toHaveBeenCalledWith({
                where: { id: editRestaurantInput.restaurantId }
            });
            expect(result).toEqual({
                ok: false,
                error: '식당을 찾을 수 없습니다.'
            });
        });

        it('should fail if not the owner', async () => {
            restaurantRepository.findOne.mockResolvedValue(new Error());

            const result = await service.editRestaurant(user, editRestaurantInput);

            expect(restaurantRepository.findOne).toHaveBeenCalledTimes(1);
            expect(result).toEqual({
                ok: false,
                error: "나의 식당이 아니면 수정할 수 없습니다."
            });
        });
        
        it('should change name', async () => {

        })
        it('should change address', async () => {

        })
        it('should change coverImg', async () => {

        })
        it('should change coverImg', async () => {

        })
    });

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