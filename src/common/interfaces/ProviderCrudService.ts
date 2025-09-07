import { FindOptionsWhere } from 'typeorm';

export abstract class ProviderCrudService<T> {
  abstract findByField(
    providerId: number,
    where: FindOptionsWhere<T>,
    relations?: string[],
  ): Promise<T>;
  abstract findAll(providerId: number, relations?: string[]): Promise<T[]>;
  abstract findById(
    providerId: number,
    id: number,
    relations?: string[],
  ): Promise<T>;
  abstract create(providerId: number, createDto: any): Promise<T>;
  abstract update(providerId: number, id: number, updateDto: any): Promise<T>;
  abstract delete(providerId: number, id: number): Promise<boolean>;
}
