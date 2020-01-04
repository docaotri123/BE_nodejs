import {MigrationInterface, QueryRunner} from "typeorm";

export class Type1578127887241 implements MigrationInterface {
    name = 'Type1578127887241'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `type` (`id` int NOT NULL AUTO_INCREMENT, `type` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `type`", undefined);
    }

}
