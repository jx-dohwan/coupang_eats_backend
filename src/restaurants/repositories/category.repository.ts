import { DataSource, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Injectable } from '@nestjs/common';

// @Injectable() 데코레이터는 이 클래스가 NestJS의 의존성 주입 시스템에 의해 관리될 수 있음을 나타냅니다.
@Injectable()
// CategoryRepository 클래스는 TypeORM의 Repository를 상속받아 구현됩니다.
// 이 클래스는 Category 엔티티에 대한 사용자 정의 리포지토리로 작동합니다.
export class CategoryRepository extends Repository<Category> {
    // 생성자에서 DataSource 인스턴스를 의존성 주입받습니다.
    // 이 DataSource는 TypeORM의 데이터 소스를 나타내며, 엔티티 매니저를 생성하는 데 사용됩니다.
    constructor(private dataSource: DataSource) {
        // 부모 클래스(Repository)의 생성자를 호출하여 Category 엔티티 타입과 생성된 엔티티 매니저를 전달합니다.
        super(Category, dataSource.createEntityManager());
    }

    // getOrCreate 메서드는 주어진 이름을 가진 Category를 조회하거나 새로 생성합니다.
    async getOrCreate(name: string): Promise<Category> {
        // 카테고리 이름을 소문자로 변환하고, 양쪽 공백을 제거합니다.
        const categoryName = name.trim().toLowerCase();
        // 카테고리 슬러그를 생성합니다. 슬러그는 URL에서 사용하기 용이한 형태로,
        // 공백과 슬래시(/), 파이프(|)를 하이픈(-)으로 대체합니다.
        const categorySlug = categoryName.replace(/[\s/|]/g, '-');
        // 슬러그를 기준으로 기존 카테고리를 조회합니다.
        let category = await this.findOne({ where: { slug: categorySlug } });
        if (!category) {
            // 해당 슬러그를 가진 카테고리가 없는 경우, 새로운 카테고리를 생성하고 저장합니다.
            category = await this.save(
                this.create({ slug: categorySlug, name: categoryName }),
            );
        }
        // 조회되거나 생성된 카테고리를 반환합니다.
        return category;
    }
}
