import { BookService } from '../services/BookService';
import { AuthorService } from '../services/AuthorService';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { PromptUtils } from '../utils/PromptUtils';

/**
 * Controller responsável pela interface e interação de Livros no terminal.
 */
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly authorService: AuthorService
  ) {}

  /**
   * Formulário interativo para cadastro de um novo livro (RF08).
   */
  public async createBook(): Promise<void> {
    ConsoleUtils.printHeader('Cadastro de Livro');
    try {
      const authors = await this.authorService.getAllAuthors();
      if (authors.length === 0) {
        ConsoleUtils.warn('Nenhum autor cadastrado no sistema! Cadastre um autor antes de cadastrar livros.');
        return;
      }

      console.log(`${ConsoleUtils.BOLD}Autores disponíveis:${ConsoleUtils.RESET}`);
      for (const a of authors) {
        console.log(`  [ID #${a.authorId}] ${a.name} (${a.nationality})`);
      }
      console.log('');

      const title = await PromptUtils.askText('Título do Livro');
      const authorId = await PromptUtils.askInt('ID do Autor');
      const genre = await PromptUtils.askText('Gênero Literário');
      const publicationYear = await PromptUtils.askInt('Ano de Publicação');
      const availableCopies = await PromptUtils.askInt('Quantidade de Exemplares Disponíveis', 1);

      const created = await this.bookService.createBook(
        title,
        authorId,
        genre,
        publicationYear,
        availableCopies
      );

      ConsoleUtils.success(`Livro "${created.title}" cadastrado com sucesso! [ID: #${created.bookId}]`);
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Listagem formatada de todos os livros cadastrados (RF08).
   */
  public async listBooks(): Promise<void> {
    ConsoleUtils.printHeader('Listagem de Livros');
    try {
      const books = await this.bookService.getAllBooks();
      if (books.length === 0) {
        ConsoleUtils.info('Nenhum livro cadastrado no sistema.');
      } else {
        console.log(`\n${ConsoleUtils.BOLD}Total de livros cadastrados:${ConsoleUtils.RESET} ${books.length}\n`);
        console.log(
          `${'ID'.padEnd(5)} | ${'TÍTULO'.padEnd(30)} | ${'AUTOR'.padEnd(24)} | ${'GÊNERO'.padEnd(18)} | ${'ANO'.padEnd(6)} | DISPONÍVEL`
        );
        ConsoleUtils.divider();
        for (const b of books) {
          let authorName = 'Desconhecido';
          try {
            const author = await this.authorService.getAuthorById(b.authorId);
            authorName = author.name;
          } catch {
            // mantém fallback
          }

          const id = `#${b.bookId}`.padEnd(5);
          const title = (b.title.length > 28 ? b.title.substring(0, 25) + '...' : b.title).padEnd(30);
          const author = (authorName.length > 22 ? authorName.substring(0, 19) + '...' : authorName).padEnd(24);
          const genre = (b.genre.length > 16 ? b.genre.substring(0, 13) + '...' : b.genre).padEnd(18);
          const year = String(b.publicationYear).padEnd(6);
          const copiesColor = b.availableCopies > 0 ? ConsoleUtils.GREEN : ConsoleUtils.RED;
          const status = `${copiesColor}${b.availableCopies} un.${ConsoleUtils.RESET}`;

          console.log(`${id} | ${title} | ${author} | ${genre} | ${year} | ${status}`);
        }
      }
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Consulta detalhada de livro por identificador (RF08).
   */
  public async findBookById(): Promise<void> {
    ConsoleUtils.printHeader('Consulta de Livro por ID');
    try {
      const id = await PromptUtils.askInt('Informe o ID do Livro a pesquisar');
      const book = await this.bookService.getBookById(id);
      const author = await this.authorService.getAuthorById(book.authorId);

      console.log(`\n${ConsoleUtils.BOLD}--- Detalhes do Livro ---${ConsoleUtils.RESET}`);
      console.log(`${ConsoleUtils.CYAN}ID:${ConsoleUtils.RESET}                    #${book.bookId}`);
      console.log(`${ConsoleUtils.CYAN}Título:${ConsoleUtils.RESET}                ${book.title}`);
      console.log(`${ConsoleUtils.CYAN}Autor:${ConsoleUtils.RESET}                 ${author.name} (ID #${author.authorId})`);
      console.log(`${ConsoleUtils.CYAN}Gênero:${ConsoleUtils.RESET}                ${book.genre}`);
      console.log(`${ConsoleUtils.CYAN}Ano de Publicação:${ConsoleUtils.RESET}     ${book.publicationYear}`);
      console.log(
        `${ConsoleUtils.CYAN}Exemplares em Estoque:${ConsoleUtils.RESET} ${book.availableCopies} un. (${
          book.isAvailable() ? ConsoleUtils.GREEN + 'Disponível para Empréstimo' : ConsoleUtils.RED + 'Esgotado'
        }${ConsoleUtils.RESET})`
      );
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Atualização de dados de um livro existente (RF08).
   */
  public async updateBook(): Promise<void> {
    ConsoleUtils.printHeader('Atualização de Livro');
    try {
      const id = await PromptUtils.askInt('Informe o ID do Livro que deseja atualizar');
      const current = await this.bookService.getBookById(id);

      console.log(`\nEditando livro: ${ConsoleUtils.BOLD}${current.title}${ConsoleUtils.RESET} (Pressione Enter para manter o valor atual)\n`);

      const title = await PromptUtils.askText('Novo Título', current.title);
      const authorId = await PromptUtils.askInt('Novo ID do Autor', current.authorId);
      const genre = await PromptUtils.askText('Novo Gênero Literário', current.genre);
      const publicationYear = await PromptUtils.askInt('Novo Ano de Publicação', current.publicationYear);
      const availableCopies = await PromptUtils.askInt('Nova Quantidade de Exemplares', current.availableCopies);

      const updated = await this.bookService.updateBook(
        id,
        title,
        authorId,
        genre,
        publicationYear,
        availableCopies
      );

      ConsoleUtils.success(`Livro #${updated.bookId} atualizado com sucesso!`);
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Remoção de um livro do sistema (RF08).
   */
  public async deleteBook(): Promise<void> {
    ConsoleUtils.printHeader('Remoção de Livro');
    try {
      const id = await PromptUtils.askInt('Informe o ID do Livro que deseja remover');
      const book = await this.bookService.getBookById(id);

      const confirm = await PromptUtils.askConfirm(
        `Tem certeza que deseja remover o livro "${book.title}" (ID #${book.bookId})?`
      );

      if (confirm) {
        await this.bookService.deleteBook(id);
        ConsoleUtils.success(`Livro "${book.title}" removido com sucesso.`);
      } else {
        ConsoleUtils.info('Operação cancelada pelo usuário.');
      }
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }
}
