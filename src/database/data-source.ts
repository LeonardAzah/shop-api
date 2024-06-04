import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());

export default new DataSource({
  type: 'mysql',
  url: process.env.DATASOURCE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [join(__dirname, '/../../', 'database/migrations/**/*{.ts,.js}')],

  // entities: ['dist/domain/**/*.entity.js'],
  // migrations: ['dist/database/migrations/*.js'],
});
