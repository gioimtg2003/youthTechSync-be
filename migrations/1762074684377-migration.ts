import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1762074684377 implements MigrationInterface {
  name = 'Migration1762074684377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "roles" ADD "teamId" integer`);
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_a1e792e60b4957da073caf8d648" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_a1e792e60b4957da073caf8d648"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "teamId"`);
  }
}
