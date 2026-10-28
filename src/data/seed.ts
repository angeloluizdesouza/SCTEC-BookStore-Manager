import { Author } from '../models/Author';
import { Book } from '../models/Book';
import { Client } from '../models/Client';
import { Loan } from '../models/Loan';
import { IAuthorRepository } from '../repositories/IAuthorRepository';
import { IBookRepository } from '../repositories/IBookRepository';
import { IClientRepository } from '../repositories/IClientRepository';
import { ILoanRepository } from '../repositories/ILoanRepository';

/**
 * Carrega a massa de dados inicial (Seed Data) idêntica à Seção 2 do script.sql.
 */
export async function loadSeedData(
  authorRepo: IAuthorRepository,
  bookRepo: IBookRepository,
  clientRepo: IClientRepository,
  loanRepo: ILoanRepository
): Promise<void> {
  // Autores
  const authorsData: Author[] = [
    new Author(1, 'Machado de Assis', 'Brasileira', new Date(1839, 5, 21)),
    new Author(2, 'Clarice Lispector', 'Brasileira', new Date(1920, 11, 10)),
    new Author(3, 'George Orwell', 'Britânica', new Date(1903, 5, 25)),
    new Author(4, 'J.R.R. Tolkien', 'Britânica', new Date(1892, 0, 3)),
    new Author(5, 'Gabriel García Márquez', 'Colombiana', new Date(1927, 2, 6)),
  ];

  for (const author of authorsData) {
    await authorRepo.create(author);
  }

  // Livros
  const booksData: Book[] = [
    new Book(1, 'Dom Casmurro', 1, 'Romance / Realismo', 1899, 3),
    new Book(2, 'Memórias Póstumas de Brás Cubas', 1, 'Romance / Realismo', 1881, 2),
    new Book(3, 'A Hora da Estrela', 2, 'Ficção Moderna', 1977, 4),
    new Book(4, '1984', 3, 'Ficção Distópica', 1949, 2),
    new Book(5, 'A Revolução dos Bichos', 3, 'Fábula Política', 1945, 5),
    new Book(6, 'O Hobbit', 4, 'Alta Fantasia', 1937, 3),
    new Book(7, 'O Senhor dos Anéis: A Sociedade do Anel', 4, 'Alta Fantasia', 1954, 1),
    new Book(8, 'Cem Anos de Solidão', 5, 'Realismo Mágico', 1967, 4),
  ];

  for (const book of booksData) {
    await bookRepo.create(book);
    const author = await authorRepo.findById(book.authorId);
    if (author) {
      author.addBook(book);
    }
  }

  // Clientes
  const clientsData: Client[] = [
    new Client(1, 'Ana Clara Ribeiro', 'ana.ribeiro@email.com', '(11) 98765-4321', new Date(1995, 3, 15)),
    new Client(2, 'Bruno Henrique Martins', 'bruno.martins@email.com', '(21) 97654-3210', new Date(1988, 8, 22)),
    new Client(3, 'Camila Rodrigues Silva', 'camila.silva@email.com', '(31) 99876-1234', new Date(2001, 1, 10)),
    new Client(4, 'Diego Santos Ferreira', 'diego.santos@email.com', '(41) 99123-4567', new Date(1992, 10, 30)),
    new Client(5, 'Eduarda Lima Costa', 'eduarda.lima@email.com', '(51) 98456-7890', new Date(1998, 6, 5)),
  ];

  for (const client of clientsData) {
    await clientRepo.create(client);
  }

  // Empréstimos
  const loansData: Loan[] = [
    new Loan(1, 1, 1, new Date('2026-10-01'), new Date('2026-10-15'), true),
    new Loan(2, 3, 2, new Date('2026-10-05'), new Date('2026-10-18'), true),
    new Loan(3, 4, 3, new Date('2026-10-10'), null, false),
    new Loan(4, 6, 4, new Date('2026-10-12'), null, false),
    new Loan(5, 7, 1, new Date('2026-10-15'), null, false),
    new Loan(6, 2, 5, new Date('2026-10-20'), null, false),
  ];

  for (const loan of loansData) {
    await loanRepo.create(loan);
  }
}
