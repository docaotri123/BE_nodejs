import {MigrationInterface, QueryRunner} from "typeorm";

export class initType1578130026165 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`insert into type(type) values('vip')`);
        await queryRunner.query(`insert into type(type) values('normal')`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
