import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1766221111138 implements MigrationInterface {
  name = 'Migration1766221111138';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_invites_type_enum" AS ENUM('0', '1')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_invites" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "uid" character varying(255) NOT NULL, "email" character varying(100), "type" "public"."user_invites_type_enum" NOT NULL DEFAULT '0', "usedAt" TIMESTAMP WITH TIME ZONE, "invitedById" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "UQ_ef1c1fcb4090076fcc28c953670" UNIQUE ("email"), CONSTRAINT "PK_32ea679531e84878e97446e8d3f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0b9783db34e0870f2842c2f6f8" ON "user_invites" ("uid") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ef1c1fcb4090076fcc28c95367" ON "user_invites" ("email") `,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD "isAutoAcceptMember" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invites" ADD CONSTRAINT "FK_95c9f58bd4fd41f69a4be6215d4" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invites" ADD CONSTRAINT "FK_f975582bbd0ca7024a7157901f5" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_invites" DROP CONSTRAINT "FK_f975582bbd0ca7024a7157901f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invites" DROP CONSTRAINT "FK_95c9f58bd4fd41f69a4be6215d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP COLUMN "isAutoAcceptMember"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ef1c1fcb4090076fcc28c95367"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0b9783db34e0870f2842c2f6f8"`,
    );
    await queryRunner.query(`DROP TABLE "user_invites"`);
    await queryRunner.query(`DROP TYPE "public"."user_invites_type_enum"`);
  }
}
