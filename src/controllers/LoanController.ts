import { LoanService } from '../services/LoanService';
import { BookService } from '../services/BookService';
import { ClientService } from '../services/ClientService';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { PromptUtils } from '../utils/PromptUtils';
import { DateUtils } from '../utils/DateUtils';

/**
 * Controller responsável pela interface e interação de Empréstimos e Devoluções no terminal.
 */
export class LoanController {
  constructor(
    private readonly loanService: LoanService,
    private readonly bookService: BookService,
    private readonly clientService: ClientService
  ) {}

  /**
   * Formulário interativo para registrar um novo empréstimo de livro (RF10).
   */
  public async createLoan(): Promise<void> {
    ConsoleUtils.printHeader('Realizar Novo Empréstimo');
    try {
      // Exibe livros disponíveis para empréstimo
      const allBooks = await this.bookService.getAllBooks();
      const availableBooks = allBooks.filter(b => b.isAvailable());

      if (availableBooks.length === 0) {
        ConsoleUtils.warn('Não há livros com exemplares disponíveis para empréstimo no momento!');
        return;
      }

      console.log(`${ConsoleUtils.BOLD}Livros disponíveis para empréstimo:${ConsoleUtils.RESET}`);
      for (const b of availableBooks) {
        console.log(`  [ID #${b.bookId}] "${b.title}" - ${b.availableCopies} exemplar(es) disponível(is)`);
      }
      console.log('');

      const bookId = await PromptUtils.askInt('ID do Livro a ser emprestado');
      const book = await this.bookService.getBookById(bookId);

      // Exibe clientes cadastrados
      const clients = await this.clientService.getAllClients();
      if (clients.length === 0) {
        ConsoleUtils.warn('Nenhum cliente cadastrado no sistema! Cadastre um cliente antes de realizar empréstimos.');
        return;
      }

      console.log(`\n${ConsoleUtils.BOLD}Clientes cadastrados:${ConsoleUtils.RESET}`);
      for (const c of clients) {
        console.log(`  [ID #${c.clientId}] ${c.name} (${c.email})`);
      }
      console.log('');

      const clientId = await PromptUtils.askInt('ID do Cliente solicitante');
      const client = await this.clientService.getClientById(clientId);

      const confirm = await PromptUtils.askConfirm(
        `Confirmar empréstimo do livro "${book.title}" para "${client.name}"?`,
        true
      );

      if (!confirm) {
        ConsoleUtils.info('Empréstimo cancelado pelo usuário.');
        return;
      }

      const loan = await this.loanService.createLoan(bookId, clientId);
      ConsoleUtils.success(
        `Empréstimo #${loan.loanId} registrado com sucesso para "${client.name}" na data ${DateUtils.formatDate(loan.loanDate)}!`
      );
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Formulário interativo para registrar devolução de livro emprestado (RF11).
   */
  public async returnLoan(): Promise<void> {
    ConsoleUtils.printHeader('Registrar Devolução de Livro');
    try {
      const activeLoans = await this.loanService.getDetailedLoans(true);

      if (activeLoans.length === 0) {
        ConsoleUtils.info('Não há empréstimos ativos pendentes de devolução no momento.');
        return;
      }

      console.log(`\n${ConsoleUtils.BOLD}Empréstimos Ativos Pendentes:${ConsoleUtils.RESET}`);
      console.log(
        `${'ID'.padEnd(5)} | ${'LIVRO'.padEnd(28)} | ${'CLIENTE'.padEnd(24)} | RETIRADA`
      );
      ConsoleUtils.divider();
      for (const l of activeLoans) {
        const id = `#${l.loanId}`.padEnd(5);
        const book = (l.bookTitle.length > 26 ? l.bookTitle.substring(0, 23) + '...' : l.bookTitle).padEnd(28);
        const client = (l.clientName.length > 22 ? l.clientName.substring(0, 19) + '...' : l.clientName).padEnd(24);
        const date = DateUtils.formatDate(l.loanDate);
        console.log(`${id} | ${book} | ${client} | ${date}`);
      }
      console.log('');

      const loanId = await PromptUtils.askInt('Informe o ID do Empréstimo a devolver');
      const returnedLoan = await this.loanService.returnLoan(loanId);

      ConsoleUtils.success(
        `Devolução do empréstimo #${returnedLoan.loanId} confirmada com sucesso na data ${DateUtils.formatDate(returnedLoan.returnDate)}!`
      );
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Consulta e listagem completa de empréstimos cadastrados (RF12).
   */
  public async listLoans(filterActiveOnly: boolean = false): Promise<void> {
    const title = filterActiveOnly ? 'Empréstimos Ativos (Em Aberto)' : 'Histórico Geral de Empréstimos';
    ConsoleUtils.printHeader(title);
    try {
      const loans = await this.loanService.getDetailedLoans(filterActiveOnly);

      if (loans.length === 0) {
        ConsoleUtils.info('Nenhum empréstimo encontrado para os critérios selecionados.');
      } else {
        console.log(`\n${ConsoleUtils.BOLD}Total de registros:${ConsoleUtils.RESET} ${loans.length}\n`);
        console.log(
          `${'ID'.padEnd(5)} | ${'LIVRO'.padEnd(26)} | ${'CLIENTE'.padEnd(22)} | ${'EMPRÉSTIMO'.padEnd(12)} | ${'DEVOLUÇÃO'.padEnd(12)} | STATUS`
        );
        ConsoleUtils.divider();
        for (const l of loans) {
          const id = `#${l.loanId}`.padEnd(5);
          const book = (l.bookTitle.length > 24 ? l.bookTitle.substring(0, 21) + '...' : l.bookTitle).padEnd(26);
          const client = (l.clientName.length > 20 ? l.clientName.substring(0, 17) + '...' : l.clientName).padEnd(22);
          const loanDate = DateUtils.formatDate(l.loanDate).padEnd(12);
          const returnDate = DateUtils.formatDate(l.returnDate).padEnd(12);
          const statusColor = l.isReturned ? ConsoleUtils.GREEN : ConsoleUtils.YELLOW;
          const status = `${statusColor}${l.status}${ConsoleUtils.RESET}`;

          console.log(`${id} | ${book} | ${client} | ${loanDate} | ${returnDate} | ${status}`);
        }
      }
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }
}
