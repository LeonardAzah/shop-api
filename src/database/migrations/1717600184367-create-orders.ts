import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrders1717600184367 implements MigrationInterface {
    name = 'CreateOrders1717600184367'

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
            CREATE TABLE \`category\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`product\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` varchar(255) NULL,
                \`price\` decimal(6, 2) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_22cc43e9a74d7498546e9a63e7\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`order_item\` (
                \`orderId\` varchar(255) NOT NULL,
                \`productId\` varchar(255) NOT NULL,
                \`quantity\` int NOT NULL,
                \`price\` decimal(6, 2) NOT NULL,
                PRIMARY KEY (\`orderId\`, \`productId\`)
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
            CREATE TABLE \`product_to_category\` (
                \`productId\` varchar(36) NOT NULL,
                \`categoryId\` varchar(36) NOT NULL,
                INDEX \`IDX_c4ec20a1cb494c9c3e34c8da10\` (\`productId\`),
                INDEX \`IDX_70eb26cea4105a27ce856dca20\` (\`categoryId\`),
                PRIMARY KEY (\`productId\`, \`categoryId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\`
            ADD CONSTRAINT \`FK_d09d285fe1645cd2f0db811e293\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_item\`
            ADD CONSTRAINT \`FK_646bf9ece6f45dbe41c203e06e0\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_item\`
            ADD CONSTRAINT \`FK_904370c093ceea4369659a3c810\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`order\`
            ADD CONSTRAINT \`FK_124456e637cca7a415897dce659\` FOREIGN KEY (\`customerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_to_category\`
            ADD CONSTRAINT \`FK_c4ec20a1cb494c9c3e34c8da105\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_to_category\`
            ADD CONSTRAINT \`FK_70eb26cea4105a27ce856dca20d\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`product_to_category\` DROP FOREIGN KEY \`FK_70eb26cea4105a27ce856dca20d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`product_to_category\` DROP FOREIGN KEY \`FK_c4ec20a1cb494c9c3e34c8da105\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_124456e637cca7a415897dce659\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_904370c093ceea4369659a3c810\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_646bf9ece6f45dbe41c203e06e0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_d09d285fe1645cd2f0db811e293\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_70eb26cea4105a27ce856dca20\` ON \`product_to_category\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_c4ec20a1cb494c9c3e34c8da10\` ON \`product_to_category\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product_to_category\`
        `);
        await queryRunner.query(`
            DROP TABLE \`order\`
        `);
        await queryRunner.query(`
            DROP TABLE \`order_item\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_22cc43e9a74d7498546e9a63e7\` ON \`product\`
        `);
        await queryRunner.query(`
            DROP TABLE \`product\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\`
        `);
        await queryRunner.query(`
            DROP TABLE \`category\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_d09d285fe1645cd2f0db811e29\` ON \`payment\`
        `);
        await queryRunner.query(`
            DROP TABLE \`payment\`
        `);
    }

}
