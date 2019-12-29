import {MigrationInterface, QueryRunner} from "typeorm";

export class DropFKUserIdTempBooking1577606606489 implements MigrationInterface {
    name = 'DropFKUserIdTempBooking1577606606489'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `temp_book_room` DROP FOREIGN KEY `FK_d5f257ac2df9c84dfe9e705c47b`", undefined);
        await queryRunner.query("ALTER TABLE `temp_book_room` DROP COLUMN `userId`", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `temp_book_room` ADD `userId` varchar(36) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `temp_book_room` ADD CONSTRAINT `FK_d5f257ac2df9c84dfe9e705c47b` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

}
