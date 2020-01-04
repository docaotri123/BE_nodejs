import {MigrationInterface, QueryRunner} from "typeorm";

export class initRole1578129283346 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`insert into role(role) values('admin')`);
        await queryRunner.query(`insert into role(role) values('customer')`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
