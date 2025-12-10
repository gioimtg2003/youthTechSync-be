import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765341141241 implements MigrationInterface {
  name = 'Migration1765341141241';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "FK_21fa2829c68333e180618ecaae5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8a8cf14dab55b4ebcd93bb536a"`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "authorId"`);
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "UQ_8a8cf14dab55b4ebcd93bb536a1"`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "slug"`);
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "content"`);
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "thumbnails"`);
    await queryRunner.query(
      `ALTER TABLE "contents" ALTER COLUMN "tags" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contents" ALTER COLUMN "tags" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "thumbnails" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "content" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "slug" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD CONSTRAINT "UQ_8a8cf14dab55b4ebcd93bb536a1" UNIQUE ("slug")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "title" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "authorId" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8a8cf14dab55b4ebcd93bb536a" ON "contents" ("slug") `,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD CONSTRAINT "FK_21fa2829c68333e180618ecaae5" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
