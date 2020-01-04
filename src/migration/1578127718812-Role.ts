import {MigrationInterface, QueryRunner} from "typeorm";

export class Role1578127718812 implements MigrationInterface {
    name = 'Role1578127718812'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `role` (`id` int NOT NULL AUTO_INCREMENT, `role` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `role`", undefined);
    }

}
