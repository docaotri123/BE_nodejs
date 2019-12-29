import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFKGroupId_TempBooking1577606741737 implements MigrationInterface {
    name = 'AddFKGroupId_TempBooking1577606741737'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `temp_book_room` ADD `groupId` int NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `temp_book_room` ADD CONSTRAINT `FK_fc05a6d487d81d4db02973163d8` FOREIGN KEY (`groupId`) REFERENCES `group_booking`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `temp_book_room` DROP FOREIGN KEY `FK_fc05a6d487d81d4db02973163d8`", undefined);
        await queryRunner.query("ALTER TABLE `temp_book_room` DROP COLUMN `groupId`", undefined);
    }

}
