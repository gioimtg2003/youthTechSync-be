import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1767015570329 implements MigrationInterface {
  name = 'Migration1767015570329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_join_requests_status_enum" AS ENUM('0', '1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_join_requests" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "status" "public"."user_join_requests_status_enum" NOT NULL DEFAULT '0', "message" text, "userId" integer NOT NULL, "teamId" integer NOT NULL, "inviteId" integer, "actionById" integer, CONSTRAINT "PK_4b3dab9e16cec4a744ab961922f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_join_requests" ADD CONSTRAINT "FK_51d2c8d3376db5c2785ead69d8d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_join_requests" ADD CONSTRAINT "FK_6234a95137492122d2044b54ca6" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_join_requests" ADD CONSTRAINT "FK_9082178c446616080a4586721a8" FOREIGN KEY ("inviteId") REFERENCES "user_invites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_join_requests" ADD CONSTRAINT "FK_a35c2f08d532aa3fbf95c9092fa" FOREIGN KEY ("actionById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_join_requests" DROP CONSTRAINT "FK_a35c2f08d532aa3fbf95c9092fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_join_requests" DROP CONSTRAINT "FK_9082178c446616080a4586721a8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_join_requests" DROP CONSTRAINT "FK_6234a95137492122d2044b54ca6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_join_requests" DROP CONSTRAINT "FK_51d2c8d3376db5c2785ead69d8d"`,
    );
    await queryRunner.query(`DROP TABLE "user_join_requests"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_join_requests_status_enum"`,
    );
  }
}
