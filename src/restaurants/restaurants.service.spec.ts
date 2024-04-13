import { Test } from "@nestjs/testing";
import { RestaurantService } from "./restaurants.service";
import { Repository } from "typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Category } from "./entities/category.entity";
import { Dish } from "./entities/dish.entity";
import { Reviews } from "./entities/reviews.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CategoryRepository } from "./repositories/category.repository";

const mockRepository = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
});

const mockCategoryRepository = () => ({
    ...mockRepository(),
    getOrCreate: jest.fn(),
});

describe('RestaurantService', () => {
    let service: RestaurantService;
    let restaurantRepository: Repository<Restaurant>;
    let categoryRepository: CategoryRepository;
    let dishRepository: Repository<Dish>;
    let reviewRepository: Repository<Reviews>;

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
        restaurantRepository = module.get<Repository<Restaurant>>(getRepositoryToken(Restaurant));
        categoryRepository = module.get<CategoryRepository>(CategoryRepository);
        dishRepository = module.get<Repository<Dish>>(getRepositoryToken(Dish));
        reviewRepository = module.get<Repository<Reviews>>(getRepositoryToken(Reviews));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.todo('createRestaurant');
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
});