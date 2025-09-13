import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1757754230006 implements MigrationInterface {
  name = 'Migration1757754230006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(255) NOT NULL, "description" text, "permission" text array NOT NULL DEFAULT '{}', CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."post_audits_action_enum" AS ENUM('created', 'edited', 'deleted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_audits" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "action" "public"."post_audits_action_enum" NOT NULL, "contentSnapshot" text NOT NULL, "postId" integer NOT NULL, "editorId" integer NOT NULL, CONSTRAINT "PK_67a264d63149194ab269271ae17" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."posts_status_enum" AS ENUM('1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "content" text NOT NULL, "tags" text array NOT NULL DEFAULT '{}', "status" "public"."posts_status_enum" NOT NULL DEFAULT '1', "thumbnails" text array NOT NULL DEFAULT '{}', "authorId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_54ddf9075260407dcfdd7248577" UNIQUE ("slug"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_54ddf9075260407dcfdd724857" ON "posts" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."resources_type_enum" AS ENUM('1', '2', '3', '4')`,
    );
    await queryRunner.query(
      `CREATE TABLE "resources" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(255) NOT NULL, "description" text, "slug" character varying(255) NOT NULL, "type" "public"."resources_type_enum" NOT NULL DEFAULT '1', "metadata" jsonb, "isActive" boolean NOT NULL DEFAULT true, "parentId" integer, "teamId" integer, CONSTRAINT "UQ_9bc050eb2c77e448471cafbc6f3" UNIQUE ("slug"), CONSTRAINT "PK_632484ab9dff41bba94f9b7c85e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_9bc050eb2c77e448471cafbc6f" ON "resources" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "teams" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying(255) NOT NULL, "alias" character varying(255), "description" text, "logoUrl" character varying, "settings" jsonb, CONSTRAINT "UQ_4cf3c6d1a5c09187a77a18b9cef" UNIQUE ("alias"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4cf3c6d1a5c09187a77a18b9ce" ON "teams" ("alias") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_plan_enum" AS ENUM('1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "profile" jsonb, "plan" "public"."users_plan_enum" NOT NULL DEFAULT '1', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_users" ("usersId" integer NOT NULL, "teamsId" integer NOT NULL, CONSTRAINT "PK_a75d8ab6293f401fa26b63f7950" PRIMARY KEY ("usersId", "teamsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6bed1c3c7ef7e7d5525ae5e3e8" ON "team_users" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5238f26366a11d886159563efe" ON "team_users" ("teamsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "post_audits" ADD CONSTRAINT "FK_c72eb246320be460387899b76f4" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_audits" ADD CONSTRAINT "FK_2f6cd8b05fc2a92b83e7f9ce342" FOREIGN KEY ("editorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_f39001eef913eb8d1f69d5a408c" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "resources" ADD CONSTRAINT "FK_802ca9cf0339acee31e3673251d" FOREIGN KEY ("parentId") REFERENCES "resources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "resources" ADD CONSTRAINT "FK_60ab3720f7811abb36d96657653" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_users" ADD CONSTRAINT "FK_6bed1c3c7ef7e7d5525ae5e3e89" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_users" ADD CONSTRAINT "FK_5238f26366a11d886159563efed" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_users" DROP CONSTRAINT "FK_5238f26366a11d886159563efed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_users" DROP CONSTRAINT "FK_6bed1c3c7ef7e7d5525ae5e3e89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resources" DROP CONSTRAINT "FK_60ab3720f7811abb36d96657653"`,
    );
    await queryRunner.query(
      `ALTER TABLE "resources" DROP CONSTRAINT "FK_802ca9cf0339acee31e3673251d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_f39001eef913eb8d1f69d5a408c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_audits" DROP CONSTRAINT "FK_2f6cd8b05fc2a92b83e7f9ce342"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_audits" DROP CONSTRAINT "FK_c72eb246320be460387899b76f4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5238f26366a11d886159563efe"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6bed1c3c7ef7e7d5525ae5e3e8"`,
    );
    await queryRunner.query(`DROP TABLE "team_users"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_plan_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4cf3c6d1a5c09187a77a18b9ce"`,
    );
    await queryRunner.query(`DROP TABLE "teams"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bc050eb2c77e448471cafbc6f"`,
    );
    await queryRunner.query(`DROP TABLE "resources"`);
    await queryRunner.query(`DROP TYPE "public"."resources_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_54ddf9075260407dcfdd724857"`,
    );
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TYPE "public"."posts_status_enum"`);
    await queryRunner.query(`DROP TABLE "post_audits"`);
    await queryRunner.query(`DROP TYPE "public"."post_audits_action_enum"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
