import {MigrationInterface, QueryRunner} from "typeorm";

export class DropFKUserBookRoom1577606409887 implements MigrationInterface {
    name = 'DropFKUserBookRoom1577606409887'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `book_room` DROP COLUMN `groupId`", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `book_room` ADD `groupId` int NOT NULL", undefined);
    }

}
