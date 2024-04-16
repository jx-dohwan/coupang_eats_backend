
/* 일단 보류 프론트엔드 끝내고 와서 다시 하기
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

jest.mock('got', () => {
    return {
      post: jest.fn(),
    };
  });
  
  const GRAPHQL_ENDPOINT = '/graphql';
  
  const testUser = {
    email: 'nico@las.com',
    password: '12345',
  };
  
  
  describe('AppController (e2e)', () => {
    let app: INestApplication;
    let restaurantRepository: Repository<Restaurant>;
    let jwtToken: string;
  
    const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
    const publicTest = (query: string) => baseTest().send({ query });
    const privateTest = (query: string) =>
      baseTest()
        .set('X-JWT', jwtToken)
        .send({ query });
  
  
    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      app = module.createNestApplication();
      restaurantRepository = module.get<Repository<Restaurant>>(getRepositoryToken(Restaurant));
      await app.init();
    });
    afterAll(async () => {
      const dataSource: DataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      const connection: DataSource = await dataSource.initialize();
      await connection.dropDatabase(); // 데이터베이스 삭제
      await connection.destroy(); // 연결 해제
      await app.close();
    });

  describe('createRestaurant', () => {
    it('should create a restaurant', () => {
      const createRestaurantMutation = `
        mutation {
          createRestaurant(input: {
            name: "Test Restaurant",
            coverImg: "http://example.com/image.jpg",
            address: "Test Address",
            categoryName: "Test Category"
          }) {
            ok
            error
            restaurantId
          }
        }
      `;
      return publicTest(createRestaurantMutation)
        .expect(200)
        .expect(res => {
          expect(res.body.data.createRestaurant.ok).toBe(true);
          expect(res.body.data.createRestaurant.error).toBe(null);
          expect(res.body.data.createRestaurant.restaurantId).toBeDefined();
        });
    });
  });

  describe('myRestaurants', () => {
    it("should return the owner's restaurants", () => {
      const myRestaurantsQuery = `
        {
          myRestaurants {
            ok
            error
            restaurants {
              id
              name
            }
          }
        }
      `;
      return privateTest(myRestaurantsQuery)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.myRestaurants.ok).toBe(true);
          expect(res.body.data.myRestaurants.error).toBe(null);
          expect(res.body.data.myRestaurants.restaurants).toBeInstanceOf(Array);
        });
    });
  });

  describe('myRestaurant', () => {
    it('should return a specific restaurant by ID', () => {
      const myRestaurantQuery = `
        {
          myRestaurant(id: 1) {
            ok
            error
            restaurant {
              id
              name
            }
          }
        }
      `;
      return privateTest(myRestaurantQuery)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.myRestaurant.ok).toBe(true);
          expect(res.body.data.myRestaurant.error).toBe(null);
          expect(res.body.data.myRestaurant.restaurant).toBeDefined();
        });
    });
  });

  describe('editRestaurant', () => {
    it('should edit a restaurant', () => {
      const editRestaurantMutation = `
        mutation {
          editRestaurant(input: {
            restaurantId: 1,
            name: "Updated Restaurant",
            address: "Updated Address"
          }) {
            ok
            error
          }
        }
      `;
      return privateTest(editRestaurantMutation)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.editRestaurant.ok).toBe(true);
          expect(res.body.data.editRestaurant.error).toBe(null);
        });
    });
  });

  describe('deleteRestaurant', () => {
    it('should delete a restaurant', () => {
      const deleteRestaurantMutation = `
        mutation {
          deleteRestaurant(restaurantId: 1) {
            ok
            error
          }
        }
      `;
      return privateTest(deleteRestaurantMutation)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.deleteRestaurant.ok).toBe(true);
          expect(res.body.data.deleteRestaurant.error).toBe(null);
        });
    });
  });

});
*/
