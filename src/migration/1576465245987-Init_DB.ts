import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDB1576465245987 implements MigrationInterface {
    name = 'InitDB1576465245987'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, `role` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `user` (`id` varchar(36) NOT NULL, `email` varchar(255) NOT NULL, `phone` varchar(255) NOT NULL, `password` text NOT NULL, `roleId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `type` (`id` int NOT NULL AUTO_INCREMENT, `type` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `room` (`id` int NOT NULL AUTO_INCREMENT, `description` varchar(255) NOT NULL, `imageURL` varchar(255) NOT NULL, `quality` int NOT NULL, `price` int NOT NULL, `isDeleted` tinyint NOT NULL DEFAULT 0, `typeId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `book_room` (`id` int NOT NULL AUTO_INCREMENT, `startDate` datetime NOT NULL, `endDate` datetime NOT NULL, `isCancelled` tinyint NOT NULL DEFAULT 0, `userId` varchar(36) NOT NULL, `roomId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `room` ADD CONSTRAINT `FK_77887d1cb01d949a3ced97ab0a0` FOREIGN KEY (`typeId`) REFERENCES `type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `book_room` ADD CONSTRAINT `FK_e88136ffc483bd1f5a68628b0e7` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `book_room` ADD CONSTRAINT `FK_9b9081964118a30e5024d1ba8fb` FOREIGN KEY (`roomId`) REFERENCES `room`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `book_room` DROP FOREIGN KEY `FK_9b9081964118a30e5024d1ba8fb`", undefined);
        await queryRunner.query("ALTER TABLE `book_room` DROP FOREIGN KEY `FK_e88136ffc483bd1f5a68628b0e7`", undefined);
        await queryRunner.query("ALTER TABLE `room` DROP FOREIGN KEY `FK_77887d1cb01d949a3ced97ab0a0`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_c28e52f758e7bbc53828db92194`", undefined);
        await queryRunner.query("DROP TABLE `book_room`", undefined);
        await queryRunner.query("DROP TABLE `room`", undefined);
        await queryRunner.query("DROP TABLE `type`", undefined);
        await queryRunner.query("DROP TABLE `user`", undefined);
        await queryRunner.query("DROP TABLE `role`", undefined);
    }

}
