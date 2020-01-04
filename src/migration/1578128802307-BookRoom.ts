import {MigrationInterface, QueryRunner} from "typeorm";

export class BookRoom1578128802307 implements MigrationInterface {
    name = 'BookRoom1578128802307'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `book_room` (`id` int NOT NULL AUTO_INCREMENT, `startDate` datetime NOT NULL, `endDate` datetime NOT NULL, `isCancelled` tinyint NOT NULL DEFAULT 0, `groupId` int NOT NULL, `roomId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `book_room` ADD CONSTRAINT `FK_907cbbc249181e0b05b67151a48` FOREIGN KEY (`groupId`) REFERENCES `group_booking`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `book_room` ADD CONSTRAINT `FK_9b9081964118a30e5024d1ba8fb` FOREIGN KEY (`roomId`) REFERENCES `room`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `book_room` DROP FOREIGN KEY `FK_9b9081964118a30e5024d1ba8fb`", undefined);
        await queryRunner.query("ALTER TABLE `book_room` DROP FOREIGN KEY `FK_907cbbc249181e0b05b67151a48`", undefined);
        await queryRunner.query("DROP TABLE `book_room`", undefined);
    }

}
