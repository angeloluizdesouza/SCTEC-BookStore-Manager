import { Author } from '../models/Author';

export interface IAuthorRepository {
  create(author: Author): Promise<Author>;
  findAll(): Promise<Author[]>;
  findById(id: number): Promise<Author | null>;
  update(author: Author): Promise<Author>;
  delete(id: number): Promise<boolean>;
  getNextId(): Promise<number>;
}
