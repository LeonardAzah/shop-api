import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  type: 'mysql',
  username: 'root',
  password: 'lamar',
  host: 'localhost',
  port: 3306,
  database: 'shop_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [join(__dirname, '/../../', 'database/migrations/**/*{.ts,.js}')],

  // entities: ['dist/domain/**/*.entity.js'],
  // migrations: ['dist/database/migrations/*.js'],
});
