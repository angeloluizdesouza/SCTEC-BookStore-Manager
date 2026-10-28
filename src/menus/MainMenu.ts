import { AuthorMenu } from './AuthorMenu';
import { BookMenu } from './BookMenu';
import { ClientMenu } from './ClientMenu';
import { LoanMenu } from './LoanMenu';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { PromptUtils } from '../utils/PromptUtils';

/**
 * Menu principal da aplicação BookStore Manager (RF06).
 */
export class MainMenu {
  constructor(
    private readonly authorMenu: AuthorMenu,
    private readonly bookMenu: BookMenu,
    private readonly clientMenu: ClientMenu,
    private readonly loanMenu: LoanMenu
  ) {}

  public async show(): Promise<void> {
    let running = true;
    while (running) {
      ConsoleUtils.clear();
      ConsoleUtils.printHeader('Menu Principal');
      console.log(` ${ConsoleUtils.BOLD}1.${ConsoleUtils.RESET} 🖋️  Gerenciamento de Autores`);
      console.log(` ${ConsoleUtils.BOLD}2.${ConsoleUtils.RESET} 📖 Gerenciamento de Livros`);
      console.log(` ${ConsoleUtils.BOLD}3.${ConsoleUtils.RESET} 👤 Gerenciamento de Clientes`);
      console.log(` ${ConsoleUtils.BOLD}4.${ConsoleUtils.RESET} 🔄 Gerenciamento de Empréstimos e Devoluções`);
      console.log(` ${ConsoleUtils.BOLD}0.${ConsoleUtils.RESET} 🚪 Encerrar Aplicação`);
      ConsoleUtils.divider();

      const option = await PromptUtils.askText('Selecione um módulo');
      switch (option) {
        case '1':
          await this.authorMenu.show();
          break;
        case '2':
          await this.bookMenu.show();
          break;
        case '3':
          await this.clientMenu.show();
          break;
        case '4':
          await this.loanMenu.show();
          break;
        case '0':
          ConsoleUtils.clear();
          ConsoleUtils.printHeader('Encerramento');
          console.log(`\n${ConsoleUtils.GREEN}Obrigado por utilizar o BookStore Manager! Até logo.${ConsoleUtils.RESET}\n`);
          PromptUtils.close();
          running = false;
          break;
        default:
          ConsoleUtils.warn('Opção inválida! Escolha um dos módulos apresentados.');
          await PromptUtils.pause();
          break;
      }
    }
  }
}
