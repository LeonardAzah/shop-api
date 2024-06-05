import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrder1717584163832 implements MigrationInterface {
    name = 'CreateOrder1717584163832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`order\` (
                \`id\` varchar(36) NOT NULL,
                \`status\` enum (
                    'AWAITING_PAYMENT',
                    'AWAITING_SHIPMENT',
                    'SHIPPED',
                    'IN_TRANSIT',
                    ' COMPLETED',
                    'CANCELED'
                ) NOT NULL DEFAULT 'AWAITING_PAYMENT',
                \`customerId\` varchar(36) NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`order\`
            ADD CONSTRAINT \`FK_124456e637cca7a415897dce659\` FOREIGN KEY (\`customerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_124456e637cca7a415897dce659\`
        `);
        await queryRunner.query(`
            DROP TABLE \`order\`
        `);
    }

}
