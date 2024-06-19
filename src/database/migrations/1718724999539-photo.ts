import { MigrationInterface, QueryRunner } from "typeorm";

export class Photo1718724999539 implements MigrationInterface {
    name = 'Photo1718724999539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`photo\` varchar(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`photo\`
        `);
    }

}
