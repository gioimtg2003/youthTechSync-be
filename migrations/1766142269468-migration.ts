import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1766142269468 implements MigrationInterface {
  name = 'Migration1766142269468';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "team_invites" (
        "id" SERIAL NOT NULL,
        "token" character varying(255) NOT NULL,
        "teamId" integer NOT NULL,
        "invitedBy" integer NOT NULL,
        "email" character varying(100),
        "expiresAt" TIMESTAMP NOT NULL,
        "usedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_team_invites_token" UNIQUE ("token"),
        CONSTRAINT "PK_team_invites" PRIMARY KEY ("id")
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_team_invites_token" ON "team_invites" ("token")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_team_invites_teamId" ON "team_invites" ("teamId")`,
    );

    await queryRunner.query(
      `ALTER TABLE "team_invites" ADD CONSTRAINT "FK_team_invites_teamId" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "team_invites" ADD CONSTRAINT "FK_team_invites_invitedBy" FOREIGN KEY ("invitedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_invites" DROP CONSTRAINT "FK_team_invites_invitedBy"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_invites" DROP CONSTRAINT "FK_team_invites_teamId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_team_invites_teamId"`);
    await queryRunner.query(`DROP INDEX "IDX_team_invites_token"`);
    await queryRunner.query(`DROP TABLE "team_invites"`);
  }
}
