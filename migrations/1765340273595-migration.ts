import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765340273595 implements MigrationInterface {
  name = 'Migration1765340273595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "FK_8a0f7dfebeb4d2fb37772b0242b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "FK_3c472943669a14cda6f52c99c97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP CONSTRAINT "FK_a4fb61c6b93950f65270bb91804"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "FK_21fa2829c68333e180618ecaae5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8a8cf14dab55b4ebcd93bb536a"`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "metadata"`);
    await queryRunner.query(
      `ALTER TABLE "contents" DROP COLUMN "createdByUserId"`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "resourceId"`);
    await queryRunner.query(
      `ALTER TABLE "contents" DROP COLUMN "bodyLastSnapshot"`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "body"`);
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP COLUMN "postId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP COLUMN "contentSnapshot"`,
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
      `ALTER TABLE "contents" ADD "title" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "slug" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD CONSTRAINT "UQ_8a8cf14dab55b4ebcd93bb536a1" UNIQUE ("slug")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "content" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "thumbnails" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "authorId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD "contentId" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "contents" ADD "body" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "bodyLastSnapshot" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "contents" ADD "metadata" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "createdByUserId" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "contents" ADD "resourceId" integer`);
    await queryRunner.query(
      `ALTER TABLE "contents" ALTER COLUMN "tags" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8a8cf14dab55b4ebcd93bb536a" ON "contents" ("slug") `,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD CONSTRAINT "FK_21fa2829c68333e180618ecaae5" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD CONSTRAINT "FK_13e6fe45d4f728f31e5493bac94" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD CONSTRAINT "FK_8a0f7dfebeb4d2fb37772b0242b" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD CONSTRAINT "FK_3c472943669a14cda6f52c99c97" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "FK_3c472943669a14cda6f52c99c97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "FK_8a0f7dfebeb4d2fb37772b0242b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP CONSTRAINT "FK_13e6fe45d4f728f31e5493bac94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "FK_21fa2829c68333e180618ecaae5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8a8cf14dab55b4ebcd93bb536a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ALTER COLUMN "tags" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "resourceId"`);
    await queryRunner.query(
      `ALTER TABLE "contents" DROP COLUMN "createdByUserId"`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "metadata"`);
    await queryRunner.query(
      `ALTER TABLE "contents" DROP COLUMN "bodyLastSnapshot"`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "body"`);
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP COLUMN "contentId"`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "authorId"`);
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "thumbnails"`);
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "content"`);
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "UQ_8a8cf14dab55b4ebcd93bb536a1"`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "slug"`);
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "title"`);
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
      `ALTER TABLE "content_audits" ADD "contentSnapshot" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD "postId" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "contents" ADD "body" text NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "bodyLastSnapshot" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "contents" ADD "resourceId" integer`);
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "createdByUserId" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "contents" ADD "metadata" jsonb`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8a8cf14dab55b4ebcd93bb536a" ON "contents" ("slug") `,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD CONSTRAINT "FK_21fa2829c68333e180618ecaae5" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD CONSTRAINT "FK_a4fb61c6b93950f65270bb91804" FOREIGN KEY ("postId") REFERENCES "contents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD CONSTRAINT "FK_3c472943669a14cda6f52c99c97" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD CONSTRAINT "FK_8a0f7dfebeb4d2fb37772b0242b" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
