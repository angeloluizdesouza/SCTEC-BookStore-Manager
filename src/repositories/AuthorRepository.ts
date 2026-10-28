import { Author } from '../models/Author';
import { IAuthorRepository } from './IAuthorRepository';

/**
 * Repositório em memória para persistência de autores.
 */
export class AuthorRepository implements IAuthorRepository {
  private authors: Map<number, Author> = new Map();
  private currentId: number = 0;

  public async create(author: Author): Promise<Author> {
    if (author.authorId <= 0) {
      this.currentId += 1;
      author.authorId = this.currentId;
    } else if (author.authorId > this.currentId) {
      this.currentId = author.authorId;
    }
    this.authors.set(author.authorId, author);
    return author;
  }

  public async findAll(): Promise<Author[]> {
    return Array.from(this.authors.values());
  }

  public async findById(id: number): Promise<Author | null> {
    return this.authors.get(id) ?? null;
  }

  public async update(author: Author): Promise<Author> {
    if (!this.authors.has(author.authorId)) {
      throw new Error(`Autor com ID ${author.authorId} não encontrado no repositório.`);
    }
    this.authors.set(author.authorId, author);
    return author;
  }

  public async delete(id: number): Promise<boolean> {
    return this.authors.delete(id);
  }

  public async getNextId(): Promise<number> {
    return this.currentId + 1;
  }
}
