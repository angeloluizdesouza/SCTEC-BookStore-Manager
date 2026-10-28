import { Book } from './Book';

export interface IAuthor {
  authorId: number;
  name: string;
  nationality: string;
  birthDate: Date;
}

/**
 * Entidade que representa um Autor no sistema.
 */
export class Author implements IAuthor {
  private _authorId: number;
  private _name: string;
  private _nationality: string;
  private _birthDate: Date;
  private _books: Book[] = [];

  constructor(authorId: number, name: string, nationality: string, birthDate: Date) {
    this._authorId = authorId;
    this._name = name;
    this._nationality = nationality;
    this._birthDate = birthDate;
  }

  public get authorId(): number {
    return this._authorId;
  }

  public set authorId(value: number) {
    this._authorId = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get nationality(): string {
    return this._nationality;
  }

  public set nationality(value: string) {
    this._nationality = value;
  }

  public get birthDate(): Date {
    return this._birthDate;
  }

  public set birthDate(value: Date) {
    this._birthDate = value;
  }

  /**
   * Adiciona um livro à lista de obras escritas por este autor.
   */
  public addBook(book: Book): void {
    if (!this._books.some(b => b.bookId === book.bookId)) {
      this._books.push(book);
    }
  }

  /**
   * Remove um livro da lista de obras pelo ID.
   */
  public removeBook(bookId: number): void {
    this._books = this._books.filter(b => b.bookId !== bookId);
  }

  /**
   * Retorna a lista de livros do autor.
   */
  public getBooks(): Book[] {
    return [...this._books];
  }
}
