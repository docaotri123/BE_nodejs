import {MigrationInterface, QueryRunner} from "typeorm";

export class initRoom1578453344598 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`insert into room(description,imageURL,quality,price,isDeleted,typeId) 
            values('This is vip','https://www.w3schools.com/html/pic_trulli.jpg',5,3000,false,1)`);

        await queryRunner.query(`insert into room(description,imageURL,quality,price,isDeleted,typeId) 
            values('This is normal','https://www.w3schools.com/html/pic_trulli.jpg',4,2500,false,2)`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
