export interface IBook {
  bookId: number;
  title: string;
  authorId: number;
  genre: string;
  publicationYear: number;
  availableCopies: number;
}

/**
 * Entidade que representa um Livro no sistema.
 */
export class Book implements IBook {
  private _bookId: number;
  private _title: string;
  private _authorId: number;
  private _genre: string;
  private _publicationYear: number;
  private _availableCopies: number;

  constructor(
    bookId: number,
    title: string,
    authorId: number,
    genre: string,
    publicationYear: number,
    availableCopies: number = 1
  ) {
    this._bookId = bookId;
    this._title = title;
    this._authorId = authorId;
    this._genre = genre;
    this._publicationYear = publicationYear;
    this._availableCopies = Math.max(0, availableCopies);
  }

  public get bookId(): number {
    return this._bookId;
  }

  public set bookId(value: number) {
    this._bookId = value;
  }

  public get title(): string {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get authorId(): number {
    return this._authorId;
  }

  public set authorId(value: number) {
    this._authorId = value;
  }

  public get genre(): string {
    return this._genre;
  }

  public set genre(value: string) {
    this._genre = value;
  }

  public get publicationYear(): number {
    return this._publicationYear;
  }

  public set publicationYear(value: number) {
    this._publicationYear = value;
  }

  public get availableCopies(): number {
    return this._availableCopies;
  }

  public set availableCopies(value: number) {
    this._availableCopies = Math.max(0, value);
  }

  /**
   * Verifica se o livro possui ao menos um exemplar disponível para empréstimo.
   */
  public isAvailable(): boolean {
    return this._availableCopies > 0;
  }

  /**
   * Registra a saída de um exemplar para empréstimo.
   */
  public loanOut(): void {
    if (!this.isAvailable()) {
      throw new Error(`Não há exemplares disponíveis do livro "${this._title}" para empréstimo.`);
    }
    this._availableCopies -= 1;
  }

  /**
   * Registra a devolução de um exemplar.
   */
  public returnBook(): void {
    this._availableCopies += 1;
  }
}
