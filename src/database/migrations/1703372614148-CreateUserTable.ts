import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1703372614148 implements MigrationInterface {
  name = 'CreateUserTable1703372614148';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_orm_role_enum" AS ENUM('admin', 'default')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_orm" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_orm_role_enum" NOT NULL DEFAULT 'default', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_0cdf47b1b57fb6d0fc367cecd7e" UNIQUE ("email"), CONSTRAINT "PK_4fdc636f375e88848512de33d6e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_orm"`);
    await queryRunner.query(`DROP TYPE "public"."user_orm_role_enum"`);
  }
}
