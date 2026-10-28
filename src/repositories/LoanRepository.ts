import { Loan } from '../models/Loan';
import { ILoanRepository } from './ILoanRepository';

/**
 * Repositório em memória para persistência de empréstimos.
 */
export class LoanRepository implements ILoanRepository {
  private loans: Map<number, Loan> = new Map();
  private currentId: number = 0;

  public async create(loan: Loan): Promise<Loan> {
    if (loan.loanId <= 0) {
      this.currentId += 1;
      loan.loanId = this.currentId;
    } else if (loan.loanId > this.currentId) {
      this.currentId = loan.loanId;
    }
    this.loans.set(loan.loanId, loan);
    return loan;
  }

  public async findAll(): Promise<Loan[]> {
    return Array.from(this.loans.values());
  }

  public async findById(id: number): Promise<Loan | null> {
    return this.loans.get(id) ?? null;
  }

  public async findActiveByBookId(bookId: number): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(l => l.bookId === bookId && !l.isReturned);
  }

  public async findActiveByClientId(clientId: number): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(l => l.clientId === clientId && !l.isReturned);
  }

  public async findByClientId(clientId: number): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(l => l.clientId === clientId);
  }

  public async findByBookId(bookId: number): Promise<Loan[]> {
    return Array.from(this.loans.values()).filter(l => l.bookId === bookId);
  }

  public async update(loan: Loan): Promise<Loan> {
    if (!this.loans.has(loan.loanId)) {
      throw new Error(`Empréstimo com ID ${loan.loanId} não encontrado no repositório.`);
    }
    this.loans.set(loan.loanId, loan);
    return loan;
  }

  public async delete(id: number): Promise<boolean> {
    return this.loans.delete(id);
  }

  public async getNextId(): Promise<number> {
    return this.currentId + 1;
  }
}
