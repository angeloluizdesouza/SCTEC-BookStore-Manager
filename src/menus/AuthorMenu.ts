import { AuthorController } from '../controllers/AuthorController';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { PromptUtils } from '../utils/PromptUtils';

/**
 * Menu de navegação para o módulo de Autores.
 */
export class AuthorMenu {
  constructor(private readonly authorController: AuthorController) {}

  public async show(): Promise<void> {
    let running = true;
    while (running) {
      ConsoleUtils.clear();
      ConsoleUtils.printHeader('Módulo: Autores');
      console.log(` ${ConsoleUtils.BOLD}1.${ConsoleUtils.RESET} Cadastrar novo autor`);
      console.log(` ${ConsoleUtils.BOLD}2.${ConsoleUtils.RESET} Listar todos os autores`);
      console.log(` ${ConsoleUtils.BOLD}3.${ConsoleUtils.RESET} Consultar autor por ID`);
      console.log(` ${ConsoleUtils.BOLD}4.${ConsoleUtils.RESET} Atualizar dados do autor`);
      console.log(` ${ConsoleUtils.BOLD}5.${ConsoleUtils.RESET} Remover autor`);
      console.log(` ${ConsoleUtils.BOLD}0.${ConsoleUtils.RESET} Voltar ao Menu Principal`);
      ConsoleUtils.divider();

      const option = await PromptUtils.askText('Selecione uma opção');
      switch (option) {
        case '1':
          ConsoleUtils.clear();
          await this.authorController.createAuthor();
          break;
        case '2':
          ConsoleUtils.clear();
          await this.authorController.listAuthors();
          break;
        case '3':
          ConsoleUtils.clear();
          await this.authorController.findAuthorById();
          break;
        case '4':
          ConsoleUtils.clear();
          await this.authorController.updateAuthor();
          break;
        case '5':
          ConsoleUtils.clear();
          await this.authorController.deleteAuthor();
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
