import { MigrationInterface, QueryRunner } from "typeorm";

export class Roles1717883079087 implements MigrationInterface {
    name = 'Roles1717883079087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`role\` enum ('ADMIN', 'MANAGER', ' USER') NOT NULL DEFAULT ' USER'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`role\`
        `);
    }

}
