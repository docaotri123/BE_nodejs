import {MigrationInterface, QueryRunner} from "typeorm";

export class RevertEntiry1576220403710 implements MigrationInterface {
    name = 'RevertEntiry1576220403710'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `role` DROP COLUMN `test`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `address`", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `address` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `role` ADD `test` varchar(255) NOT NULL", undefined);
    }

}
