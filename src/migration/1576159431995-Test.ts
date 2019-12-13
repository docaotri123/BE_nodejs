import {MigrationInterface, QueryRunner} from "typeorm";

export class Test1576159431995 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE user RENAME COLUMN phone TO telephone`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE user RENAME COLUMN telephone TO phone`);
    }

}
