export interface ILoan {
  loanId: number;
  bookId: number;
  clientId: number;
  loanDate: Date;
  returnDate: Date | null;
  isReturned: boolean;
}

/**
 * Entidade que representa um Empréstimo no sistema.
 */
export class Loan implements ILoan {
  private _loanId: number;
  private _bookId: number;
  private _clientId: number;
  private _loanDate: Date;
  private _returnDate: Date | null;
  private _isReturned: boolean;

  constructor(
    loanId: number,
    bookId: number,
    clientId: number,
    loanDate: Date = new Date(),
    returnDate: Date | null = null,
    isReturned: boolean = false
  ) {
    this._loanId = loanId;
    this._bookId = bookId;
    this._clientId = clientId;
    this._loanDate = loanDate;
    this._returnDate = returnDate;
    this._isReturned = isReturned;
  }

  public get loanId(): number {
    return this._loanId;
  }

  public set loanId(value: number) {
    this._loanId = value;
  }

  public get bookId(): number {
    return this._bookId;
  }

  public set bookId(value: number) {
    this._bookId = value;
  }

  public get clientId(): number {
    return this._clientId;
  }

  public set clientId(value: number) {
    this._clientId = value;
  }

  public get loanDate(): Date {
    return this._loanDate;
  }

  public set loanDate(value: Date) {
    this._loanDate = value;
  }

  public get returnDate(): Date | null {
    return this._returnDate;
  }

  public set returnDate(value: Date | null) {
    this._returnDate = value;
  }

  public get isReturned(): boolean {
    return this._isReturned;
  }

  public set isReturned(value: boolean) {
    this._isReturned = value;
  }

  /**
   * Marca o empréstimo como devolvido registrando a data de retorno.
   */
  public markReturned(date: Date = new Date()): void {
    if (this._isReturned) {
      throw new Error(`Empréstimo #${this._loanId} já foi devolvido anteriormente.`);
    }
    this._isReturned = true;
    this._returnDate = date;
  }
}
