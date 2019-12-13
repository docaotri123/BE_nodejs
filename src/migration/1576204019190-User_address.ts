import {MigrationInterface, QueryRunner} from "typeorm";

export class UserAddress1576204019190 implements MigrationInterface {
    name = 'UserAddress1576204019190'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `address` varchar(255) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `address`", undefined);
    }

}
