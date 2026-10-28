import { BookController } from '../controllers/BookController';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { PromptUtils } from '../utils/PromptUtils';

/**
 * Menu de navegação para o módulo de Livros.
 */
export class BookMenu {
  constructor(private readonly bookController: BookController) {}

  public async show(): Promise<void> {
    let running = true;
    while (running) {
      ConsoleUtils.clear();
      ConsoleUtils.printHeader('Módulo: Livros');
      console.log(` ${ConsoleUtils.BOLD}1.${ConsoleUtils.RESET} Cadastrar novo livro`);
      console.log(` ${ConsoleUtils.BOLD}2.${ConsoleUtils.RESET} Listar todos os livros`);
      console.log(` ${ConsoleUtils.BOLD}3.${ConsoleUtils.RESET} Consultar livro por ID`);
      console.log(` ${ConsoleUtils.BOLD}4.${ConsoleUtils.RESET} Atualizar dados do livro`);
      console.log(` ${ConsoleUtils.BOLD}5.${ConsoleUtils.RESET} Remover livro`);
      console.log(` ${ConsoleUtils.BOLD}0.${ConsoleUtils.RESET} Voltar ao Menu Principal`);
      ConsoleUtils.divider();

      const option = await PromptUtils.askText('Selecione uma opção');
      switch (option) {
        case '1':
          ConsoleUtils.clear();
          await this.bookController.createBook();
          break;
        case '2':
          ConsoleUtils.clear();
          await this.bookController.listBooks();
          break;
        case '3':
          ConsoleUtils.clear();
          await this.bookController.findBookById();
          break;
        case '4':
          ConsoleUtils.clear();
          await this.bookController.updateBook();
          break;
        case '5':
          ConsoleUtils.clear();
          await this.bookController.deleteBook();
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
