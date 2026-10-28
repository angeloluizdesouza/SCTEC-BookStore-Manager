import { Book } from '../models/Book';
import { IBookRepository } from './IBookRepository';

/**
 * Repositório em memória para persistência de livros.
 */
export class BookRepository implements IBookRepository {
  private books: Map<number, Book> = new Map();
  private currentId: number = 0;

  public async create(book: Book): Promise<Book> {
    if (book.bookId <= 0) {
      this.currentId += 1;
      book.bookId = this.currentId;
    } else if (book.bookId > this.currentId) {
      this.currentId = book.bookId;
    }
    this.books.set(book.bookId, book);
    return book;
  }

  public async findAll(): Promise<Book[]> {
    return Array.from(this.books.values());
  }

  public async findById(id: number): Promise<Book | null> {
    return this.books.get(id) ?? null;
  }

  public async findByAuthorId(authorId: number): Promise<Book[]> {
    return Array.from(this.books.values()).filter(b => b.authorId === authorId);
  }

  public async update(book: Book): Promise<Book> {
    if (!this.books.has(book.bookId)) {
      throw new Error(`Livro com ID ${book.bookId} não encontrado no repositório.`);
    }
    this.books.set(book.bookId, book);
    return book;
  }

  public async delete(id: number): Promise<boolean> {
    return this.books.delete(id);
  }

  public async getNextId(): Promise<number> {
    return this.currentId + 1;
  }
}
