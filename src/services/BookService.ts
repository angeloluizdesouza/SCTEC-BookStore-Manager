import { Book } from '../models/Book';
import { IBookRepository } from '../repositories/IBookRepository';
import { IAuthorRepository } from '../repositories/IAuthorRepository';
import { ILoanRepository } from '../repositories/ILoanRepository';
import { ValidationUtils } from '../utils/ValidationUtils';

/**
 * Serviço responsável pelas regras de negócio e validações da entidade Livro.
 */
export class BookService {
  constructor(
    private readonly bookRepo: IBookRepository,
    private readonly authorRepo: IAuthorRepository,
    private readonly loanRepo: ILoanRepository
  ) { }

  public async createBook(
    title: string,
    authorId: number,
    genre: string,
    publicationYear: number,
    availableCopies: number = 1
  ): Promise<Book> {
    if (!ValidationUtils.isNotEmpty(title)) {
      throw new Error('O título do livro é obrigatório.');
    }
    if (!ValidationUtils.isValidId(authorId)) {
      throw new Error('ID do autor inválido.');
    }

    const author = await this.authorRepo.findById(authorId);
    if (!author) {
      throw new Error(`Autor com ID #${authorId} não foi encontrado. O livro deve ser vinculado a um autor cadastrado.`);
    }

    if (!ValidationUtils.isNotEmpty(genre)) {
      throw new Error('O gênero do livro é obrigatório.');
    }
    if (!ValidationUtils.isValidYear(publicationYear)) {
      throw new Error(`Ano de publicação inválido: ${publicationYear}.`);
    }
    if (availableCopies < 0) {
      throw new Error('A quantidade de exemplares disponíveis não pode ser negativa.');
    }

    const nextId = await this.bookRepo.getNextId();
    const book = new Book(
      nextId,
      title.trim(),
      authorId,
      genre.trim(),
      publicationYear,
      availableCopies
    );

    const savedBook = await this.bookRepo.create(book);
    author.addBook(savedBook);
    return savedBook;
  }

  public async getAllBooks(): Promise<Book[]> {
    const list = await this.bookRepo.findAll();
    return list.sort((a, b) => a.bookId - b.bookId);
  }

  public async getBookById(id: number): Promise<Book> {
    if (!ValidationUtils.isValidId(id)) {
      throw new Error('ID do livro deve ser um número inteiro positivo.');
    }
    const book = await this.bookRepo.findById(id);
    if (!book) {
      throw new Error(`Livro com ID #${id} não foi encontrado.`);
    }
    return book;
  }

  public async getBooksByAuthor(authorId: number): Promise<Book[]> {
    return await this.bookRepo.findByAuthorId(authorId);
  }

  public async updateBook(
    id: number,
    title: string,
    authorId: number,
    genre: string,
    publicationYear: number,
    availableCopies: number
  ): Promise<Book> {
    const book = await this.getBookById(id);

    if (!ValidationUtils.isNotEmpty(title)) {
      throw new Error('O título do livro não pode ser vazio.');
    }
    const author = await this.authorRepo.findById(authorId);
    if (!author) {
      throw new Error(`Autor com ID #${authorId} não existe.`);
    }
    if (!ValidationUtils.isNotEmpty(genre)) {
      throw new Error('O gênero não pode ser vazio.');
    }
    if (!ValidationUtils.isValidYear(publicationYear)) {
      throw new Error(`Ano de publicação inválido: ${publicationYear}.`);
    }
    if (availableCopies < 0) {
      throw new Error('A quantidade de exemplares não pode ser negativa.');
    }

    // Se o autor foi alterado, atualiza as referências
    if (book.authorId !== authorId) {
      const oldAuthor = await this.authorRepo.findById(book.authorId);
      if (oldAuthor) {
        oldAuthor.removeBook(book.bookId);
      }
      author.addBook(book);
      book.authorId = authorId;
    }

    book.title = title.trim();
    book.genre = genre.trim();
    book.publicationYear = publicationYear;
    book.availableCopies = availableCopies;

    return await this.bookRepo.update(book);
  }

  public async deleteBook(id: number): Promise<void> {
    const book = await this.getBookById(id);
    const activeLoans = await this.loanRepo.findActiveByBookId(book.bookId);
    if (activeLoans.length > 0) {
      throw new Error(
        `Não é possível remover o livro "${book.title}" pois existem ${activeLoans.length} empréstimo(s) ativo(s) pendente(s) de devolução.`
      );
    }

    const author = await this.authorRepo.findById(book.authorId);
    if (author) {
      author.removeBook(book.bookId);
    }

    await this.bookRepo.delete(id);
  }
}
