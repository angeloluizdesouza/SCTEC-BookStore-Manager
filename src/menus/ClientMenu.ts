import { ClientController } from '../controllers/ClientController';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { PromptUtils } from '../utils/PromptUtils';

/**
 * Menu de navegação para o módulo de Clientes.
 */
export class ClientMenu {
  constructor(private readonly clientController: ClientController) {}

  public async show(): Promise<void> {
    let running = true;
    while (running) {
      ConsoleUtils.clear();
      ConsoleUtils.printHeader('Módulo: Clientes');
      console.log(` ${ConsoleUtils.BOLD}1.${ConsoleUtils.RESET} Cadastrar novo cliente`);
      console.log(` ${ConsoleUtils.BOLD}2.${ConsoleUtils.RESET} Listar todos os clientes`);
      console.log(` ${ConsoleUtils.BOLD}3.${ConsoleUtils.RESET} Consultar cliente por ID`);
      console.log(` ${ConsoleUtils.BOLD}4.${ConsoleUtils.RESET} Atualizar dados do cliente`);
      console.log(` ${ConsoleUtils.BOLD}5.${ConsoleUtils.RESET} Remover cliente`);
      console.log(` ${ConsoleUtils.BOLD}0.${ConsoleUtils.RESET} Voltar ao Menu Principal`);
      ConsoleUtils.divider();

      const option = await PromptUtils.askText('Selecione uma opção');
      switch (option) {
        case '1':
          ConsoleUtils.clear();
          await this.clientController.createClient();
          break;
        case '2':
          ConsoleUtils.clear();
          await this.clientController.listClients();
          break;
        case '3':
          ConsoleUtils.clear();
          await this.clientController.findClientById();
          break;
        case '4':
          ConsoleUtils.clear();
          await this.clientController.updateClient();
          break;
        case '5':
          ConsoleUtils.clear();
          await this.clientController.deleteClient();
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
