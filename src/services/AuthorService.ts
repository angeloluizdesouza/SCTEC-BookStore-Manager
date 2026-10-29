import { Author } from '../models/Author';
import { IAuthorRepository } from '../repositories/IAuthorRepository';
import { IBookRepository } from '../repositories/IBookRepository';
import { ValidationUtils } from '../utils/ValidationUtils';

/**
 * Serviço responsável pelas regras de negócio e validações da entidade Autor.
 */
export class AuthorService {
  constructor(
    private readonly authorRepo: IAuthorRepository,
    private readonly bookRepo: IBookRepository
  ) {}

  public async createAuthor(name: string, nationality: string, birthDate: Date): Promise<Author> {
    if (!ValidationUtils.isNotEmpty(name)) {
      throw new Error('O nome do autor é obrigatório e não pode ser vazio.');
    }
    if (!ValidationUtils.isNotEmpty(nationality)) {
      throw new Error('A nacionalidade do autor é obrigatória.');
    }
    if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
      throw new Error('A data de nascimento do autor é inválida.');
    }
    if (birthDate.getTime() > Date.now()) {
      throw new Error('A data de nascimento não pode estar no futuro.');
    }

    const nextId = await this.authorRepo.getNextId();
    const author = new Author(nextId, name.trim(), nationality.trim(), birthDate);
    return await this.authorRepo.create(author);
  }

  public async getAllAuthors(): Promise<Author[]> {
    const list = await this.authorRepo.findAll();
    return list.sort((a, b) => a.authorId - b.authorId);
  }

  public async getAuthorById(id: number): Promise<Author> {
    if (!ValidationUtils.isValidId(id)) {
      throw new Error('ID do autor deve ser um número inteiro positivo.');
    }
    const author = await this.authorRepo.findById(id);
    if (!author) {
      throw new Error(`Autor com ID #${id} não foi encontrado.`);
    }
    return author;
  }

  public async updateAuthor(id: number, name: string, nationality: string, birthDate: Date): Promise<Author> {
    const author = await this.getAuthorById(id);

    if (!ValidationUtils.isNotEmpty(name)) {
      throw new Error('O nome do autor não pode ser vazio.');
    }
    if (!ValidationUtils.isNotEmpty(nationality)) {
      throw new Error('A nacionalidade do autor não pode ser vazia.');
    }
    if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
      throw new Error('Data de nascimento inválida.');
    }
    if (birthDate.getTime() > Date.now()) {
      throw new Error('A data de nascimento não pode estar no futuro.');
    }

    author.name = name.trim();
    author.nationality = nationality.trim();
    author.birthDate = birthDate;

    return await this.authorRepo.update(author);
  }

  public async deleteAuthor(id: number): Promise<void> {
    const author = await this.getAuthorById(id);
    const books = await this.bookRepo.findByAuthorId(author.authorId);
    if (books.length > 0) {
      throw new Error(
        `Não é possível remover o autor "${author.name}" pois existem ${books.length} livro(s) vinculado(s) a ele.`
      );
    }
    await this.authorRepo.delete(id);
  }
}
