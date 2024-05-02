import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantService } from "./restaurants.service";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { Role } from "src/auth/role.decorator";
import { User } from "src/users/entities/user.entity";
import { AuthUser } from "src/auth/auth-user.decorator";
import { MyRestaurantsOutput } from "./dtos/my-restaurants.dto";
import { MyRestaurantInput, MyRestaurantOutput } from "./dtos/my-restaurant.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { RestaurantsInput, RestaurantsOutput } from "./dtos/restaurants.dto";
import { Category } from "./entities/category.entity";
import { AllCategoriesOutput } from "./dtos/all-categories.dto";
import { CategoryInput, CategoryOutput } from "./dtos/category.dto";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurant.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dtos/search-restaurant.dto";
import { Dish } from "./entities/dish.entity";
import { CreateDishInput, CreateDishOutput } from "./dtos/create-dish.dto";
import { EditDishInput, EditDishOutput } from "./dtos/edit-dish.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dtos/delete-dish.dto";
import { Reviews } from "./entities/reviews.entity";
import { CreateReviewInput, CreateReviewOutput } from "./dtos/create-review.dto";
import { EditReviewInput, EditReviewOutput } from "./dtos/edit-review.dto";
import { DeleteReviewOutput } from "./dtos/delete-review.dto";
import { MenuInput, MenuOutput } from "./dtos/menu.dto";

// RestaurantResolver 클래스를 정의합니다. @Resolver 데코레이터를 사용하여 이 클래스가 Restaurant 모델의 resolver임을 명시합니다.
@Resolver(of => Restaurant)
export class RestaurantResolver {
    // @Query 데코레이터는 데이터를 조회할 때 사용되며, 데이터베이스의 상태를 변경하지 않음 
    // @Mutation 데코레이터는 데이터를 생성, 수정, 삭제하는 등의 상태 변경 작업을 수행할 때 사용

    constructor(private readonly restaurantService: RestaurantService) { }

    @Mutation(returns => CreateRestaurantOutput)
    @Role(['Owner'])
    async createRestaurant(
        @AuthUser() authUser: User,
        @Args('input') createRestaurantInput: CreateRestaurantInput,
    ): Promise<CreateRestaurantOutput> {
        return this.restaurantService.createRestaurant(
            authUser,
            createRestaurantInput,
        );
    }

    @Query(returns => MyRestaurantsOutput)
    @Role(['Owner'])
    myRestaurants(@AuthUser() owner: User): Promise<MyRestaurantsOutput> {
        return this.restaurantService.myRestaurants(owner);
    }

    @Query(retruns => MyRestaurantOutput)
    @Role(['Owner'])
    myRestaurant(
        @AuthUser() owner: User,
        @Args('input') myRestaurantInput: MyRestaurantInput,
    ): Promise<MyRestaurantOutput> {
        return this.restaurantService.myRestaurant(owner, myRestaurantInput);
    }


    @Mutation(returns => EditRestaurantOutput)
    @Role(['Owner'])
    editRestaurant(
        @AuthUser() owner: User,
        @Args('input') editRestaurantInput: EditRestaurantInput,
    ): Promise<EditRestaurantOutput> {
        return this.restaurantService.editRestaurant(owner, editRestaurantInput);
    }

    @Mutation(returns => DeleteRestaurantOutput)
    @Role(['Owner'])
    deleteRestaurant(
        @AuthUser() owner: User,
        @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
    ): Promise<DeleteRestaurantOutput> {
        return this.restaurantService.deleteRestaurant(
            owner,
            deleteRestaurantInput,
        );
    }

    @Query(returns => RestaurantsOutput)
    restaurants(
        @Args('input') restaurantsInput: RestaurantsInput,
    ): Promise<RestaurantsOutput> {
        return this.restaurantService.allRestaurants(restaurantsInput);
    }

    @Query(returns => RestaurantOutput)
    restaurant(
        @Args('input') restaurantInput: RestaurantInput,
    ): Promise<RestaurantOutput> {
        return this.restaurantService.findRestaurantById(restaurantInput);
    }

    @Query(returns => SearchRestaurantOutput)
    searchRestaurant(
        @Args('input') searchRestaurantInput: SearchRestaurantInput,
    ): Promise<SearchRestaurantOutput> {
        return this.restaurantService.searchRestaurantByName(searchRestaurantInput);
    }
}


@Resolver(of => Category)
export class CategoryResolver {
    //@ResolveField 데코레이터는 특정 타입의 필드를 해결하기 위한 메서드를 정의할 때 사용됩니다. 
    // 이 경우, restaurantCount 메서드는 Category 타입 내부의 restaurantCount 필드의 값을 해결하는 데 사용됩니다. 
    // 즉, 이 필드가 쿼리에 포함될 때마다 restaurantCount 메서드가 실행되어 해당 필드의 값을 계산하거나 조회합니다.


    // @Parent 데코레이터는 현재 필드를 포함하고 있는 상위 객체를 인자로 전달받기 위해 사용됩니다. 
    // 여기서는 Category 타입의 인스턴스가 category 매개변수를 통해 restaurantCount 메서드에 전달됩니다. 
    // 이를 통해, 현재 처리 중인 Category 객체에 속한 레스토랑의 총 수를 계산할 수 있습니다.
    // 즉, @Parent를 사용하여 현재 필드가 속한 부모 객체의 데이터에 접근할 수 있습니다. 이는 필드 해결 로직에서 매우 유용하게 사용될 수 있습니다.
    constructor(private readonly restaurantService: RestaurantService) { }

    @ResolveField(type => Int)
    restaurantCount(@Parent() category: Category): Promise<number> {
        return this.restaurantService.countRestaurants(category);
    }

    @Query(type => AllCategoriesOutput)
    allCategories(): Promise<AllCategoriesOutput> {
        return this.restaurantService.allCategories();
    }

    @Query(type => CategoryOutput)
    category(
        @Args('input') categoryInput: CategoryInput,
    ): Promise<CategoryOutput> {
        return this.restaurantService.findCategoryBySlug(categoryInput);
    }
}

@Resolver(of => Dish)
export class DishResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Mutation(type => CreateDishOutput)
    @Role(['Owner'])
    createDish(
        @AuthUser() owner: User,
        @Args('input') createDishInput: CreateDishInput,
    ): Promise<CreateDishOutput> {
        return this.restaurantService.createDish(owner, createDishInput);
    }

    @Mutation(type => EditDishOutput)
    @Role(['Owner'])
    editDish(
        @AuthUser() owner: User,
        @Args('input') editDishInput: EditDishInput,
    ): Promise<EditDishOutput> {
        return this.restaurantService.editDish(owner, editDishInput);
    }

    @Mutation(type => DeleteDishOutput)
    @Role(['Owner'])
    deleteDish(
        @AuthUser() owner: User,
        @Args('input') deleteDishInput: DeleteDishInput,
    ): Promise<DeleteDishOutput> {
        return this.restaurantService.deleteDish(owner, deleteDishInput);
    }

    @Query(type => MenuOutput)
    menu(
        @Args('input') menuInput: MenuInput,
    ): Promise<MenuOutput> {
        return this.restaurantService.findMenuById(menuInput);
    }
}

@Resolver(of => Reviews)
export class ReviewsResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Mutation(type => CreateReviewOutput)
    @Role(['Client'])
    createReview(
        @AuthUser() client: User,
        @Args('input') createReviewInput: CreateReviewInput,
    ): Promise<CreateReviewOutput> {
        return this.restaurantService.createReview(client, createReviewInput)
    }

    @Mutation(type => EditReviewOutput)
    @Role(['Client'])
    editReview(
        @AuthUser() client: User,
        @Args('input') editReviewInput: EditReviewInput,
    ): Promise<EditReviewOutput> {
        return this.restaurantService.editReview(client, editReviewInput);
    }

    @Mutation(type => DeleteReviewOutput)
    @Role(['Client'])
    deleteReview(
        @AuthUser() client: User,
        @Args('input') deleteReviewInput: EditReviewInput,
    ): Promise<EditReviewOutput> {
        return this.restaurantService.deleteReview(client, deleteReviewInput);
    }

}