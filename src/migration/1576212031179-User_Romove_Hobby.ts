import {MigrationInterface, QueryRunner} from "typeorm";

export class UserRomoveHobby1576212031179 implements MigrationInterface {
    name = 'UserRomoveHobby1576212031179'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `hobby`", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `hobby` varchar(255) NULL", undefined);
    }

}
