import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1765340037307 implements MigrationInterface {
  name = 'Migration1765340037307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."contents_status_enum" AS ENUM('1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contents" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "content" text NOT NULL, "tags" text array NOT NULL DEFAULT '{}', "status" "public"."contents_status_enum" NOT NULL DEFAULT '1', "thumbnails" text array NOT NULL DEFAULT '{}', "authorId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_8a8cf14dab55b4ebcd93bb536a1" UNIQUE ("slug"), CONSTRAINT "PK_b7c504072e537532d7080c54fac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8a8cf14dab55b4ebcd93bb536a" ON "contents" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."content_audits_action_enum" AS ENUM('created', 'edited', 'deleted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "content_audits" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "action" "public"."content_audits_action_enum" NOT NULL, "contentSnapshot" text NOT NULL, "postId" integer NOT NULL, "editorId" integer NOT NULL, CONSTRAINT "PK_c3334b85e2a2c63a185a1b3de0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "title"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8a8cf14dab55b4ebcd93bb536a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "UQ_8a8cf14dab55b4ebcd93bb536a1"`,
    );
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "slug"`);
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "content"`);
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "thumbnails"`);
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "authorId"`);
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP COLUMN "contentSnapshot"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP COLUMN "postId"`,
    );
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
      `ALTER TABLE "content_audits" ADD "contentSnapshot" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD "postId" integer NOT NULL`,
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
      `ALTER TABLE "content_audits" ADD "ipAddress" character varying(45)`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD "userAgent" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD "requestId" character varying`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."resources_type_enum" RENAME TO "resources_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."resources_type_enum" AS ENUM('1', '2', '3', '4', '5')`,
    );
    await queryRunner.query(
      `ALTER TABLE "resources" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "resources" ALTER COLUMN "type" TYPE "public"."resources_type_enum" USING "type"::"text"::"public"."resources_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resources" ALTER COLUMN "type" SET DEFAULT '1'`,
    );
    await queryRunner.query(`DROP TYPE "public"."resources_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "contents" ALTER COLUMN "tags" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP CONSTRAINT "PK_c3334b85e2a2c63a185a1b3de0d"`,
    );
    await queryRunner.query(`ALTER TABLE "content_audits" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD CONSTRAINT "PK_c3334b85e2a2c63a185a1b3de0d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8a8cf14dab55b4ebcd93bb536a" ON "contents" ("slug") `,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD CONSTRAINT "FK_21fa2829c68333e180618ecaae5" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD CONSTRAINT "FK_5832e413dc3976d6594b8c90046" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD CONSTRAINT "FK_a4fb61c6b93950f65270bb91804" FOREIGN KEY ("postId") REFERENCES "contents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD CONSTRAINT "FK_5234af4c1e2058b3622327b746a" FOREIGN KEY ("editorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "content_audits" DROP CONSTRAINT "FK_5234af4c1e2058b3622327b746a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP CONSTRAINT "FK_a4fb61c6b93950f65270bb91804"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "FK_5832e413dc3976d6594b8c90046"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" DROP CONSTRAINT "FK_21fa2829c68333e180618ecaae5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8a8cf14dab55b4ebcd93bb536a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP CONSTRAINT "PK_c3334b85e2a2c63a185a1b3de0d"`,
    );
    await queryRunner.query(`ALTER TABLE "content_audits" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD CONSTRAINT "PK_c3334b85e2a2c63a185a1b3de0d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ALTER COLUMN "tags" SET NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."resources_type_enum_old" AS ENUM('1', '2', '3', '4')`,
    );
    await queryRunner.query(
      `ALTER TABLE "resources" ALTER COLUMN "type" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "resources" ALTER COLUMN "type" TYPE "public"."resources_type_enum_old" USING "type"::"text"::"public"."resources_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resources" ALTER COLUMN "type" SET DEFAULT '1'`,
    );
    await queryRunner.query(`DROP TYPE "public"."resources_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."resources_type_enum_old" RENAME TO "resources_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP COLUMN "requestId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP COLUMN "userAgent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP COLUMN "ipAddress"`,
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
      `ALTER TABLE "content_audits" DROP COLUMN "postId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" DROP COLUMN "contentSnapshot"`,
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
      `ALTER TABLE "content_audits" ADD "postId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "content_audits" ADD "contentSnapshot" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "authorId" integer NOT NULL`,
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
      `CREATE UNIQUE INDEX "IDX_8a8cf14dab55b4ebcd93bb536a" ON "contents" ("slug") `,
    );
    await queryRunner.query(
      `ALTER TABLE "contents" ADD "title" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "content_audits"`);
    await queryRunner.query(`DROP TYPE "public"."content_audits_action_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8a8cf14dab55b4ebcd93bb536a"`,
    );
    await queryRunner.query(`DROP TABLE "contents"`);
    await queryRunner.query(`DROP TYPE "public"."contents_status_enum"`);
  }
}
