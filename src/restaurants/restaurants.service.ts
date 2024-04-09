import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Restaurant } from "./entities/restaurant.entity";
import { Raw, Repository } from "typeorm";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { User } from "src/users/entities/user.entity";
import { CategoryRepository } from "./repositories/category.repository";
import { MyRestaurantsOutput } from "./dtos/my-restaurants.dto";
import { MyRestaurantInput, MyRestaurantOutput } from "./dtos/my-restaurant.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto";
import { Category } from "./entities/category.entity";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { AllCategoriesOutput } from "./dtos/all-categories.dto";
import { CategoryInput, CategoryOutput } from "./dtos/category.dto";
import { RestaurantsInput, RestaurantsOutput } from "./dtos/restaurants.dto";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurant.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dtos/search-restaurant.dto";

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        private readonly categories: CategoryRepository,
    ) { }

    // Restaurant
    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput,
    ): Promise<CreateRestaurantOutput> {
        try {
            const newRestaurant = this.restaurants.create(createRestaurantInput);
            newRestaurant.owner = owner;
            const category = await this.categories.getOrCreate(
                createRestaurantInput.categoryName,
            );
            newRestaurant.category = category;
            await this.restaurants.save(newRestaurant);
            return {
                ok: true,
                restaurantId: newRestaurant.id,
            }
        } catch (error) {
            return {
                ok: false,
                error: "식당을 만들 수 없습니다."
            }
        }
    }

    async myRestaurants(
        owner: User
    ): Promise<MyRestaurantsOutput> {
        try {
            const restaurants = await this.restaurants.find({
                where: { owner: { id: owner.id } },
            })
            return {
                restaurants,
                ok: true,
            };
        } catch (e) {
            return {
                ok: false,
                error: "식당을 찾을 수 없습니다."
            }
        }
    }

    async myRestaurant(
        owner: User,
        { id }: MyRestaurantInput,
    ): Promise<MyRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne({
                where: { owner: { id: owner.id }, id: id },
            });
            return {
                restaurant,
                ok: true,
            };
        } catch {
            return {
                ok: false,
                error: "식당을 찾을 수 없습니다."
            };
        }
    }

    async editRestaurant(
        owner: User,
        editRestaurantInput: EditRestaurantInput,
    ): Promise<EditRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne({
                where: { id: editRestaurantInput.restaurantId },
            });
            if (!restaurant) {
                return {
                    ok: false,
                    error: '식당을 찾을 수 없습니다.'
                };
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "나의 식당이 아니면 수정할 수 없습니다."
                };
            }
            let category: Category = null;
            if (editRestaurantInput.categoryName) {
                category = await this.categories.getOrCreate(
                    editRestaurantInput.categoryName,
                );
            }
            await this.restaurants.save([
                {
                    id: editRestaurantInput.restaurantId,
                    ...editRestaurantInput,
                    ...(category && { category }),
                },
            ]);
            return {
                ok: true,
            }
        } catch {
            return {
                ok: false,
                error: '식당을 수정할 수 없습니다.'
            };
        }
    }

    async deleteRestaurant(
        owner: User,
        { restaurantId }: DeleteRestaurantInput,
    ): Promise<DeleteRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne({ where: { id: restaurantId } });
            if (!restaurant) {
                return {
                    ok: false,
                    error: '식당을 찾을 수 없습니다.'
                };
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "나의 식당이 아니면 삭제할 수 없습니다."
                };
            }
            await this.restaurants.delete(restaurantId);
            return {
                ok: true,
            };

        } catch {
            return {
                ok: false,
                error: "식당을 삭제할 수 없습니다."
            }
        }
    }

    async allRestaurants(
        { page }: RestaurantsInput
    ): Promise<RestaurantsOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                skip: (page - 1) * 20,
                take: 20,
                order: {
                    isPromoted: 'DESC',
                },
            });
            return {
                ok: true,
                results: restaurants,
                totalPages: Math.ceil(totalResults / 20),
                totalResults,
            }
        } catch {
            return {
                ok: false,
                error: '식당들을 로드할 수 없습니다.',
            }
        }
    }

    async findRestaurantById({
        restaurantId,
    }: RestaurantInput): Promise<RestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne({
                where: { id: restaurantId },
                relations: ['menu']
            });

            if (!restaurant) {
                return {
                    ok: false,
                    error: '식당을 찾을 수 없습니다.'
                };
            }
            return {
                ok: true,
                restaurant,
            };
        } catch {
            return {
                ok: false,
                error: '식당을 찾을 수 없습니다.'
            }
        }
    }

    async searchRestaurantByName({
        query,
        page,
    }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                where: {
                    name: Raw(name => `${name} ILIKE '%${query}%'`),
                },
                skip: (page - 1) * 20,
                take: 20
            });
            return {
                ok: true,
                restaurants,
                totalResults,
                totalPages: Math.ceil(totalResults / 20),
            };
        } catch {
            return { ok: false, error: '식당들을 찾을 수 없습니다.' };
        }
    }


    // Category
    countRestaurants(
        category: Category
    ) {
        return this.restaurants.count({
            where: { category: { id: category.id, }, },
        });
    }

    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categories.find();
            return {
                ok: true,
                categories
            };

        } catch {
            return {
                ok: false,
                error: '카테고리를 로드할 수 없습니다.'
            }
        }
    }

    async findCategoryBySlug(
        { slug, page, }: CategoryInput
    ): Promise<CategoryOutput> {
        try {
            const category = await this.categories.findOne({ where: { slug } });

            if (!category) {
                return {
                    ok: false,
                    error: '카테고리를 찾을 수 없습니다.',
                };
            }
            const restaurants = await this.restaurants.find({
                where: { 
                    category: {
                        id: category.id, 
                    },
                },

                order: {
                    isPromoted: 'DESC',
                },
                take: 20,
                skip: (page - 1) * 20,
            });
            const totalResults = await this.countRestaurants(category);
            return {
                ok: true,
                restaurants,
                category,
                totalPages: Math.ceil(totalResults / 20),
                totalResults,
            };
        } catch {
            return {
                ok: false,
                error: '카테고리를 로드할 수 없습니다.',
            };
        }
    }


}