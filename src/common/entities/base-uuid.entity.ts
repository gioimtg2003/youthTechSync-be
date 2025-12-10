import { PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from './base-time.entity';

export class BaseUuidEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
