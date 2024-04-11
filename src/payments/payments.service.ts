import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { CreatePaymentInput, CreatePaymentOutput } from './dtos/create-payment.dto';
import { User } from 'src/users/entities/user.entity';
import { GetPaymentsOutput } from './dtos/get-payments.dto';
import { Cron, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly payments: Repository<Payment>,
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
    ) { }

    async createPayment(
        owner: User,
        { transactionId, restaurantId }: CreatePaymentInput,
    ): Promise<CreatePaymentOutput> {
        try {
            const restaurant = await this.restaurants.findOne({ where: { id: restaurantId } });
            if (!restaurant) {
                return {
                    ok: false,
                    error: '식당을 찾을 수 없습니다.',
                };
            }
            if (restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    error: '당신은 권한이 없습니다.',
                };
            }
            await this.payments.save(
                this.payments.create({
                    transactionId,
                    user: owner,
                    restaurant,
                }),
            );
            restaurant.isPromoted = true;
            const date = new Date();
            date.setDate(date.getDate() + 7);
            restaurant.promotedUntil = date;
            this.restaurants.save(restaurant);
            return {
                ok: true,
            };
        } catch {
            return { ok: false, error: 'payment를 만들 수 없습니다.' };
        }
    }

    async getPayments(user: User): Promise<GetPaymentsOutput> {
        try {
            const payments = await this.payments.find({
                relations: {
                    user: true,
                },
            });
            return {
                ok: true,
                payments,
            };
        } catch {
            return {
                ok: false,
                error: 'payments를 로드할 수 없습니다.',
            };
        }
    }
    @Interval(2000)
    // 비동기 함수 정의: 프로모션 상태가 업데이트 필요한 레스토랑을 체크하고 업데이트하는 함수
    async checkPromotedRestaurants() {
        // 현재 시각 이전에 프로모션이 종료된 레스토랑을 찾아냄
        const restaurants = await this.restaurants.find({
            where: {
                isPromoted: true, // 현재 프로모션 중인 레스토랑만 대상으로 함
                promotedUntil: LessThan(new Date()), // 프로모션 종료 시각이 현재 시각보다 이전인 경우
            },
        });

        // 찾아낸 레스토랑들을 콘솔에 출력
        console.log(restaurants);

        // 찾아낸 레스토랑들을 순회하며 각 레스토랑에 대해 다음 작업을 수행
        restaurants.forEach(async (restaurant) => {
            restaurant.isPromoted = false; // 프로모션 상태를 false로 설정하여 프로모션이 종료되었음을 표시
            restaurant.promotedUntil = null; // 프로모션 종료 시각을 null로 설정하여 더 이상 프로모션 기간이 아님을 명시

            // 위에서 변경한 레스토랑 상태를 데이터베이스에 저장
            await this.restaurants.save(restaurant);
        });
    }

}