import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAt1717765446911 implements MigrationInterface {
    name = 'AddDeletedAt1717765446911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`payment\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_item\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`order\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`deletedAt\` datetime(6) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`order\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_item\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP COLUMN \`deletedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\` DROP COLUMN \`deletedAt\`
        `);
    }

}
