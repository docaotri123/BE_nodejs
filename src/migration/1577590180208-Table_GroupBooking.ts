import {MigrationInterface, QueryRunner} from "typeorm";

export class TableGroupBooking1577590180208 implements MigrationInterface {
    name = 'TableGroupBooking1577590180208'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `group_booking` (`id` int NOT NULL AUTO_INCREMENT, `startDate` datetime NOT NULL, `userId` varchar(36) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `group_booking` ADD CONSTRAINT `FK_5ecdaa8cbc352886569ae7bd985` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `group_booking` DROP FOREIGN KEY `FK_5ecdaa8cbc352886569ae7bd985`", undefined);
        await queryRunner.query("DROP TABLE `group_booking`", undefined);
    }

}
