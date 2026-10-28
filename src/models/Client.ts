import { Book } from './Book';
import { Loan } from './Loan';

export interface IClient {
  clientId: number;
  name: string;
  email: string;
  phone: string;
  birthDate: Date;
}

/**
 * Entidade que representa um Cliente no sistema.
 */
export class Client implements IClient {
  private _clientId: number;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _birthDate: Date;

  constructor(
    clientId: number,
    name: string,
    email: string,
    phone: string,
    birthDate: Date
  ) {
    this._clientId = clientId;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._birthDate = birthDate;
  }

  public get clientId(): number {
    return this._clientId;
  }

  public set clientId(value: number) {
    this._clientId = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get phone(): string {
    return this._phone;
  }

  public set phone(value: string) {
    this._phone = value;
  }

  public get birthDate(): Date {
    return this._birthDate;
  }

  public set birthDate(value: Date) {
    this._birthDate = value;
  }

  /**
   * Solicita o empréstimo de um livro para este cliente.
   */
  public requestLoan(book: Book, loanId: number = 0): Loan {
    book.loanOut();
    return new Loan(loanId, book.bookId, this._clientId, new Date(), null, false);
  }

  /**
   * Registra a devolução de um empréstimo vinculado a este cliente.
   */
  public returnLoan(loan: Loan, book: Book): void {
    if (loan.clientId !== this._clientId) {
      throw new Error(`Empréstimo #${loan.loanId} não pertence ao cliente ${this._name}.`);
    }
    loan.markReturned();
    book.returnBook();
  }
}
