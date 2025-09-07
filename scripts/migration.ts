import { registerAs } from '@nestjs/config';
import { loadEnv } from 'src/doppler';
import { DataSource, DataSourceOptions } from 'typeorm';

loadEnv();
console.log('Start migration process');
console.log(process.env.DATABASE_URL);
console.log(process.env.DATABASE_CA_CERT);
const config = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DATABASE_CA_CERT,
  },
  entities: ['src/**/*.entity.ts'],
  migrations: ['migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
