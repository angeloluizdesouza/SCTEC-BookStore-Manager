import { Loan } from '../models/Loan';
import { ILoanRepository } from '../repositories/ILoanRepository';
import { IBookRepository } from '../repositories/IBookRepository';
import { IClientRepository } from '../repositories/IClientRepository';
import { ValidationUtils } from '../utils/ValidationUtils';

export interface DetailedLoan {
  loanId: number;
  bookId: number;
  bookTitle: string;
  clientId: number;
  clientName: string;
  clientEmail: string;
  loanDate: Date;
  returnDate: Date | null;
  isReturned: boolean;
  status: string;
}

/**
 * Serviço responsável pelas regras de negócio e validações de Empréstimos e Devoluções.
 */
export class LoanService {
  constructor(
    private readonly loanRepo: ILoanRepository,
    private readonly bookRepo: IBookRepository,
    private readonly clientRepo: IClientRepository
  ) {}

  /**
   * Realiza um novo empréstimo de livro para um cliente (RF10).
   */
  public async createLoan(bookId: number, clientId: number, loanDate: Date = new Date()): Promise<Loan> {
    if (!ValidationUtils.isValidId(bookId)) {
      throw new Error('ID do livro inválido.');
    }
    if (!ValidationUtils.isValidId(clientId)) {
      throw new Error('ID do cliente inválido.');
    }

    const book = await this.bookRepo.findById(bookId);
    if (!book) {
      throw new Error(`Livro com ID #${bookId} não foi encontrado.`);
    }

    const client = await this.clientRepo.findById(clientId);
    if (!client) {
      throw new Error(`Cliente com ID #${clientId} não foi encontrado.`);
    }

    if (!book.isAvailable()) {
      throw new Error(`O livro "${book.title}" não possui exemplares disponíveis para empréstimo no momento.`);
    }

    // Verifica se o cliente já possui um empréstimo ativo deste mesmo livro
    const activeLoans = await this.loanRepo.findActiveByClientId(clientId);
    const alreadyHasThisBook = activeLoans.some(l => l.bookId === bookId);
    if (alreadyHasThisBook) {
      throw new Error(`O cliente "${client.name}" já possui um empréstimo ativo do livro "${book.title}".`);
    }

    // Atualiza a disponibilidade do livro
    book.loanOut();
    await this.bookRepo.update(book);

    const nextId = await this.loanRepo.getNextId();
    const loan = new Loan(nextId, bookId, clientId, loanDate, null, false);
    return await this.loanRepo.create(loan);
  }

  /**
   * Registra a devolução de um empréstimo (RF11).
   */
  public async returnLoan(loanId: number, returnDate: Date = new Date()): Promise<Loan> {
    if (!ValidationUtils.isValidId(loanId)) {
      throw new Error('ID do empréstimo inválido.');
    }

    const loan = await this.loanRepo.findById(loanId);
    if (!loan) {
      throw new Error(`Empréstimo com ID #${loanId} não foi encontrado.`);
    }

    if (loan.isReturned) {
      throw new Error(`O empréstimo #${loanId} já foi devolvido anteriormente.`);
    }

    const book = await this.bookRepo.findById(loan.bookId);
    if (!book) {
      throw new Error(`Livro associado ao empréstimo (ID #${loan.bookId}) não foi encontrado.`);
    }

    // Atualiza status do empréstimo e recompõe disponibilidade do livro
    loan.markReturned(returnDate);
    book.returnBook();

    await this.bookRepo.update(book);
    return await this.loanRepo.update(loan);
  }

  public async getAllLoans(): Promise<Loan[]> {
    const list = await this.loanRepo.findAll();
    return list.sort((a, b) => b.loanDate.getTime() - a.loanDate.getTime());
  }

  public async getLoanById(id: number): Promise<Loan> {
    if (!ValidationUtils.isValidId(id)) {
      throw new Error('ID do empréstimo inválido.');
    }
    const loan = await this.loanRepo.findById(id);
    if (!loan) {
      throw new Error(`Empréstimo com ID #${id} não foi encontrado.`);
    }
    return loan;
  }

  public async getActiveLoans(): Promise<Loan[]> {
    const all = await this.loanRepo.findAll();
    return all.filter(l => !l.isReturned).sort((a, b) => b.loanDate.getTime() - a.loanDate.getTime());
  }

  /**
   * Retorna os empréstimos com informações enriquecidas de Livro e Cliente (RF12).
   */
  public async getDetailedLoans(filterActiveOnly: boolean = false): Promise<DetailedLoan[]> {
    const loans = filterActiveOnly ? await this.getActiveLoans() : await this.getAllLoans();
    const detailedList: DetailedLoan[] = [];

    for (const loan of loans) {
      const book = await this.bookRepo.findById(loan.bookId);
      const client = await this.clientRepo.findById(loan.clientId);

      detailedList.push({
        loanId: loan.loanId,
        bookId: loan.bookId,
        bookTitle: book ? book.title : `Livro ID #${loan.bookId} (Não cadastrado)`,
        clientId: loan.clientId,
        clientName: client ? client.name : `Cliente ID #${loan.clientId} (Não cadastrado)`,
        clientEmail: client ? client.email : '-',
        loanDate: loan.loanDate,
        returnDate: loan.returnDate,
        isReturned: loan.isReturned,
        status: loan.isReturned ? 'Devolvido' : 'Em Aberto (Ativo)',
      });
    }

    return detailedList;
  }
}
