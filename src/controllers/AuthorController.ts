import { AuthorService } from '../services/AuthorService';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { PromptUtils } from '../utils/PromptUtils';
import { DateUtils } from '../utils/DateUtils';

/**
 * Controller responsável pela interface e interação de Autores no terminal.
 */
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  /**
   * Formulário interativo para cadastro de um novo autor (RF07).
   */
  public async createAuthor(): Promise<void> {
    ConsoleUtils.printHeader('Cadastro de Autor');
    try {
      const name = await PromptUtils.askText('Nome completo do Autor');
      const nationality = await PromptUtils.askText('Nacionalidade');
      const birthDate = await PromptUtils.askDate('Data de Nascimento');

      const created = await this.authorService.createAuthor(name, nationality, birthDate);
      ConsoleUtils.success(`Autor "${created.name}" cadastrado com sucesso! [ID: #${created.authorId}]`);
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Listagem formatada de todos os autores cadastrados (RF07).
   */
  public async listAuthors(): Promise<void> {
    ConsoleUtils.printHeader('Listagem de Autores');
    try {
      const authors = await this.authorService.getAllAuthors();
      if (authors.length === 0) {
        ConsoleUtils.info('Nenhum autor cadastrado no sistema.');
      } else {
        console.log(`\n${ConsoleUtils.BOLD}Total de autores encontrados:${ConsoleUtils.RESET} ${authors.length}\n`);
        console.log(
          `${'ID'.padEnd(5)} | ${'NOME'.padEnd(30)} | ${'NACIONALIDADE'.padEnd(20)} | ${'NASCIMENTO'.padEnd(12)} | LIVROS`
        );
        ConsoleUtils.divider();
        for (const a of authors) {
          const id = `#${a.authorId}`.padEnd(5);
          const name = (a.name.length > 28 ? a.name.substring(0, 25) + '...' : a.name).padEnd(30);
          const nat = a.nationality.padEnd(20);
          const birth = DateUtils.formatDate(a.birthDate).padEnd(12);
          const booksCount = a.getBooks().length;
          console.log(`${id} | ${name} | ${nat} | ${birth} | ${booksCount} livro(s)`);
        }
      }
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Consulta detalhada de autor por identificador (RF07).
   */
  public async findAuthorById(): Promise<void> {
    ConsoleUtils.printHeader('Consulta de Autor por ID');
    try {
      const id = await PromptUtils.askInt('Informe o ID do Autor a pesquisar');
      const author = await this.authorService.getAuthorById(id);

      console.log(`\n${ConsoleUtils.BOLD}--- Detalhes do Autor ---${ConsoleUtils.RESET}`);
      console.log(`${ConsoleUtils.CYAN}ID:${ConsoleUtils.RESET}            #${author.authorId}`);
      console.log(`${ConsoleUtils.CYAN}Nome:${ConsoleUtils.RESET}          ${author.name}`);
      console.log(`${ConsoleUtils.CYAN}Nacionalidade:${ConsoleUtils.RESET} ${author.nationality}`);
      console.log(`${ConsoleUtils.CYAN}Nascimento:${ConsoleUtils.RESET}    ${DateUtils.formatDate(author.birthDate)}`);

      const books = author.getBooks();
      console.log(`\n${ConsoleUtils.BOLD}Livros vinculados (${books.length}):${ConsoleUtils.RESET}`);
      if (books.length === 0) {
        console.log('  (Nenhum livro cadastrado para este autor)');
      } else {
        for (const b of books) {
          console.log(`  - [ID #${b.bookId}] ${b.title} (${b.publicationYear}) - ${b.genre}`);
        }
      }
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Atualização dos dados de um autor existente (RF07).
   */
  public async updateAuthor(): Promise<void> {
    ConsoleUtils.printHeader('Atualização de Autor');
    try {
      const id = await PromptUtils.askInt('Informe o ID do Autor que deseja atualizar');
      const current = await this.authorService.getAuthorById(id);

      console.log(`\nEditando autor: ${ConsoleUtils.BOLD}${current.name}${ConsoleUtils.RESET} (Pressione Enter para manter o valor atual)\n`);

      const name = await PromptUtils.askText('Novo Nome', current.name);
      const nationality = await PromptUtils.askText('Nova Nacionalidade', current.nationality);
      const birthDate = await PromptUtils.askDate('Nova Data de Nascimento', current.birthDate);

      const updated = await this.authorService.updateAuthor(id, name, nationality, birthDate);
      ConsoleUtils.success(`Autor #${updated.authorId} atualizado com sucesso!`);
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Remoção de um autor do sistema (RF07).
   */
  public async deleteAuthor(): Promise<void> {
    ConsoleUtils.printHeader('Remoção de Autor');
    try {
      const id = await PromptUtils.askInt('Informe o ID do Autor que deseja remover');
      const author = await this.authorService.getAuthorById(id);

      const confirm = await PromptUtils.askConfirm(
        `Tem certeza que deseja remover o autor "${author.name}" (ID #${author.authorId})?`
      );

      if (confirm) {
        await this.authorService.deleteAuthor(id);
        ConsoleUtils.success(`Autor "${author.name}" removido com sucesso.`);
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
