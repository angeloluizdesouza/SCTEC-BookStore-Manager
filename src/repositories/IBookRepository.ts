import { Book } from '../models/Book';

export interface IBookRepository {
  create(book: Book): Promise<Book>;
  findAll(): Promise<Book[]>;
  findById(id: number): Promise<Book | null>;
  findByAuthorId(authorId: number): Promise<Book[]>;
  update(book: Book): Promise<Book>;
  delete(id: number): Promise<boolean>;
  getNextId(): Promise<number>;
}
