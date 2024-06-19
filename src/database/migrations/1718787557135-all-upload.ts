import { MigrationInterface, QueryRunner } from "typeorm";

export class AllUpload1718787557135 implements MigrationInterface {
    name = 'AllUpload1718787557135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`product\`
            ADD \`images\` text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`photo\` \`photo\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`photo\` \`photo\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`product\` DROP COLUMN \`images\`
        `);
    }

}
