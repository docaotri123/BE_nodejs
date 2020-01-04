import {MigrationInterface, QueryRunner} from "typeorm";

export class Temp1578128987541 implements MigrationInterface {
    name = 'Temp1578128987541'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `temp_book_room` (`id` int NOT NULL AUTO_INCREMENT, `startDate` datetime NOT NULL, `endDate` datetime NOT NULL, `status` varchar(255) NOT NULL DEFAULT 'pending', `groupId` int NOT NULL, `roomId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `temp_book_room` ADD CONSTRAINT `FK_fc05a6d487d81d4db02973163d8` FOREIGN KEY (`groupId`) REFERENCES `group_booking`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `temp_book_room` ADD CONSTRAINT `FK_e84f470be1f1e491bce7d4be10b` FOREIGN KEY (`roomId`) REFERENCES `room`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `temp_book_room` DROP FOREIGN KEY `FK_e84f470be1f1e491bce7d4be10b`", undefined);
        await queryRunner.query("ALTER TABLE `temp_book_room` DROP FOREIGN KEY `FK_fc05a6d487d81d4db02973163d8`", undefined);
        await queryRunner.query("DROP TABLE `temp_book_room`", undefined);
    }

}
