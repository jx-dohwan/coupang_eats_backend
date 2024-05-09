import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Category } from './category.entity';
import { Dish } from './dish.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Reviews } from './reviews.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    @Length(1, 20)
    name: string;

    @Field(type => String)
    @Column()
    @IsString()
    coverImg: string;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => Category, { nullable: true })
    @ManyToOne(
        type => Category,
        category => category.restaurants,
        { nullable: true, onDelete: 'SET NULL', eager: true, },
    )
    category: Category;

    @Field(type => User)
    @ManyToOne(
        type => User,
        user => user.restaurants,
        { onDelete: 'CASCADE' },
    )
    owner: User;

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number;

    @Field(type => Int)
    @Column()
    @IsNumber()
    deliveryFee: number;

    @Field(type => Int)
    @Column()
    @IsNumber()
    minimumPrice: number;

    @Field(type => Boolean)
    @Column({ default: false })
    isPromoted: boolean;

    @Field(type => Date, { nullable: true })
    @Column({ nullable: true })
    promotedUntil: Date;

    @Field(type => [Dish])
    @OneToMany(
        type => Dish,
        dish => dish.restaurant,
    )
    menu: Dish[]

    @Field(type => [Order])
    @OneToMany(
        type => Order,
        order => order.restaurant,
    )
    orders: Order[];

    @Field(type => [Reviews])
    @OneToMany(
        type => Reviews,
        review => review.restaurant,
        { onDelete: 'CASCADE', eager: true } // 식당 삭제 시 모든 리뷰 삭제
    )
    reviews?:Reviews[];

} 