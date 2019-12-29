import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFKGroupBookRoom1577606510778 implements MigrationInterface {
    name = 'AddFKGroupBookRoom1577606510778'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `book_room` ADD `groupId` int NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `book_room` ADD CONSTRAINT `FK_907cbbc249181e0b05b67151a48` FOREIGN KEY (`groupId`) REFERENCES `group_booking`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `book_room` DROP FOREIGN KEY `FK_907cbbc249181e0b05b67151a48`", undefined);
        await queryRunner.query("ALTER TABLE `book_room` DROP COLUMN `groupId`", undefined);
    }

}
