import {MigrationInterface, QueryRunner} from "typeorm";

export class Room1578128629199 implements MigrationInterface {
    name = 'Room1578128629199'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `room` (`id` int NOT NULL AUTO_INCREMENT, `description` varchar(255) NOT NULL, `imageURL` varchar(255) NOT NULL, `quality` int NOT NULL, `price` int NOT NULL, `isDeleted` tinyint NOT NULL DEFAULT 0, `typeId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `room` ADD CONSTRAINT `FK_77887d1cb01d949a3ced97ab0a0` FOREIGN KEY (`typeId`) REFERENCES `type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `room` DROP FOREIGN KEY `FK_77887d1cb01d949a3ced97ab0a0`", undefined);
        await queryRunner.query("DROP TABLE `room`", undefined);
    }

}
