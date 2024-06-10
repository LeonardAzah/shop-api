import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertAdmin1717883567139 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO \`user\` (\`id\`, \`name\`, \`email\`, \`phone\`, \`password\`, \`role\`)
          VALUES ('a6edc906-2f9f-5fb2-a373-efac406f0ef2', 'admin', 'admin@mail.com', '672345678', '$2a$12$3APln4VUcBdLHkZn4diN5uOmK17mBuN86qiYcAyXdeY6xK0sOopoi', 'ADMIN');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM \`user\` WHERE \`email\` = 'admin@mail.com';
        `);
  }
}
