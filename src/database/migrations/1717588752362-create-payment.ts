import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePayment1717588752362 implements MigrationInterface {
    name = 'CreatePayment1717588752362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`payment\` (
                \`id\` varchar(36) NOT NULL,
                \`orderId\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`REL_d09d285fe1645cd2f0db811e29\` (\`orderId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
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
            ALTER TABLE \`payment\`
            ADD CONSTRAINT \`FK_d09d285fe1645cd2f0db811e293\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_d09d285fe1645cd2f0db811e293\`
        `);
        await queryRunner.query(`
            DROP TABLE \`order\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_d09d285fe1645cd2f0db811e29\` ON \`payment\`
        `);
        await queryRunner.query(`
            DROP TABLE \`payment\`
        `);
    }

}
