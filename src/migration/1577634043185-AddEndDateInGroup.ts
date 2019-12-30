import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEndDateInGroup1577634043185 implements MigrationInterface {
    name = 'AddEndDateInGroup1577634043185'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `group_booking` ADD `endDate` datetime NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `group_booking` DROP COLUMN `endDate`", undefined);
    }

}
