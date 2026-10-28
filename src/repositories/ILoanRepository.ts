import { Loan } from '../models/Loan';

export interface ILoanRepository {
  create(loan: Loan): Promise<Loan>;
  findAll(): Promise<Loan[]>;
  findById(id: number): Promise<Loan | null>;
  findActiveByBookId(bookId: number): Promise<Loan[]>;
  findActiveByClientId(clientId: number): Promise<Loan[]>;
  findByClientId(clientId: number): Promise<Loan[]>;
  findByBookId(bookId: number): Promise<Loan[]>;
  update(loan: Loan): Promise<Loan>;
  delete(id: number): Promise<boolean>;
  getNextId(): Promise<number>;
}
