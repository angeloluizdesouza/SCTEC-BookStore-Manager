import { LoanController } from '../controllers/LoanController';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { PromptUtils } from '../utils/PromptUtils';

/**
 * Menu de navegação para o módulo de Empréstimos e Devoluções.
 */
export class LoanMenu {
  constructor(private readonly loanController: LoanController) {}

  public async show(): Promise<void> {
    let running = true;
    while (running) {
      ConsoleUtils.clear();
      ConsoleUtils.printHeader('Módulo: Empréstimos e Devoluções');
      console.log(` ${ConsoleUtils.BOLD}1.${ConsoleUtils.RESET} Realizar novo empréstimo de livro`);
      console.log(` ${ConsoleUtils.BOLD}2.${ConsoleUtils.RESET} Registrar devolução de livro`);
      console.log(` ${ConsoleUtils.BOLD}3.${ConsoleUtils.RESET} Consultar empréstimos ativos (em aberto)`);
      console.log(` ${ConsoleUtils.BOLD}4.${ConsoleUtils.RESET} Consultar histórico completo de empréstimos`);
      console.log(` ${ConsoleUtils.BOLD}0.${ConsoleUtils.RESET} Voltar ao Menu Principal`);
      ConsoleUtils.divider();

      const option = await PromptUtils.askText('Selecione uma opção');
      switch (option) {
        case '1':
          ConsoleUtils.clear();
          await this.loanController.createLoan();
          break;
        case '2':
          ConsoleUtils.clear();
          await this.loanController.returnLoan();
          break;
        case '3':
          ConsoleUtils.clear();
          await this.loanController.listLoans(true);
          break;
        case '4':
          ConsoleUtils.clear();
          await this.loanController.listLoans(false);
          break;
        case '0':
          running = false;
          break;
        default:
          ConsoleUtils.warn('Opção inválida! Escolha uma das opções do menu.');
          await PromptUtils.pause();
          break;
      }
    }
  }
}
