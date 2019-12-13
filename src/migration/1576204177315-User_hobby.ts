import {MigrationInterface, QueryRunner} from "typeorm";

export class UserHobby1576204177315 implements MigrationInterface {
    name = 'UserHobby1576204177315'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` ADD `hobby` varchar(255) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `hobby`", undefined);
    }

}
