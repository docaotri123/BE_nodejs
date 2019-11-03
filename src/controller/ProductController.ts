import { EntityManager, TransactionManager, getManager } from 'typeorm';
import { ResponseObj } from '../model/response';
import { Controller, Get, Param } from 'routing-controllers';
import { Product } from '../entity/Product';

@Controller()
export class ProductController {
    @Get('/products')
    async getProducts() {
        try {
            const products = await getManager()
            .createQueryBuilder()
            .select('p.id' as 'Id')
            .addSelect('p.name' as 'Name')
            .addSelect('p.code' as 'Code')
            .from(Product, 'p')
            .getMany();

            return new ResponseObj(200, 'Success', products);
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

    @Get('/product/:id')
    async getProductById(@Param('id') id: number) {
        try {
            const products = await getManager()
            .createQueryBuilder()
            .select('p')
            .from(Product, 'p')
            .where('p.id = :id', { id: id})
            .getOne();

            return new ResponseObj(200, 'Success', products);
        } catch (err) {
            console.log(err);
            return new ResponseObj(500, err);
        }
    }

}
