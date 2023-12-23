import 'reflect-metadata';
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseConfig = () =>
  ({
    type: process.env.DATABASE as 'postgres' | 'mysql' | 'mongodb',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
  }) as DataSourceOptions;

export const AppDataSource = new DataSource({
  ...databaseConfig(),
  synchronize: true,
  logging: false,
  entities: ['src/**/*.orm.{ts,js}'],
  migrations: ['src/database/migrations/*.{ts,js}'],
  subscribers: [],
});
