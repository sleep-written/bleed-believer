import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1693315050817 implements MigrationInterface {
    name = 'CreateDb1693315050817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(128) NOT NULL, "username" varchar(64) NOT NULL, "email" varchar(128) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "Post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" nvarchar(512) NOT NULL, "body" nvarchar(2048) NOT NULL, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_Post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" nvarchar(512) NOT NULL, "body" nvarchar(2048) NOT NULL, "userId" integer, CONSTRAINT "FK_97e81bcb59530bfb061e48aee6a" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_Post"("id", "title", "body", "userId") SELECT "id", "title", "body", "userId" FROM "Post"`);
        await queryRunner.query(`DROP TABLE "Post"`);
        await queryRunner.query(`ALTER TABLE "temporary_Post" RENAME TO "Post"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Post" RENAME TO "temporary_Post"`);
        await queryRunner.query(`CREATE TABLE "Post" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" nvarchar(512) NOT NULL, "body" nvarchar(2048) NOT NULL, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "Post"("id", "title", "body", "userId") SELECT "id", "title", "body", "userId" FROM "temporary_Post"`);
        await queryRunner.query(`DROP TABLE "temporary_Post"`);
        await queryRunner.query(`DROP TABLE "Post"`);
        await queryRunner.query(`DROP TABLE "User"`);
    }

}
