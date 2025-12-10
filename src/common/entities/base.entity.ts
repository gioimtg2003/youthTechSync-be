import { PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from './base-time.entity';

export class BaseEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
