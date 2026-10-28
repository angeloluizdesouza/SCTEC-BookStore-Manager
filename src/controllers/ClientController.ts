import { ClientService } from '../services/ClientService';
import { ConsoleUtils } from '../utils/ConsoleUtils';
import { PromptUtils } from '../utils/PromptUtils';
import { DateUtils } from '../utils/DateUtils';

/**
 * Controller responsável pela interface e interação de Clientes no terminal.
 */
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  /**
   * Formulário interativo para cadastro de um novo cliente (RF09).
   */
  public async createClient(): Promise<void> {
    ConsoleUtils.printHeader('Cadastro de Cliente');
    try {
      const name = await PromptUtils.askText('Nome completo do Cliente');
      const email = await PromptUtils.askText('E-mail');
      const phone = await PromptUtils.askText('Telefone de Contato');
      const birthDate = await PromptUtils.askDate('Data de Nascimento');

      const created = await this.clientService.createClient(name, email, phone, birthDate);
      ConsoleUtils.success(`Cliente "${created.name}" cadastrado com sucesso! [ID: #${created.clientId}]`);
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Listagem formatada de todos os clientes cadastrados (RF09).
   */
  public async listClients(): Promise<void> {
    ConsoleUtils.printHeader('Listagem de Clientes');
    try {
      const clients = await this.clientService.getAllClients();
      if (clients.length === 0) {
        ConsoleUtils.info('Nenhum cliente cadastrado no sistema.');
      } else {
        console.log(`\n${ConsoleUtils.BOLD}Total de clientes cadastrados:${ConsoleUtils.RESET} ${clients.length}\n`);
        console.log(
          `${'ID'.padEnd(5)} | ${'NOME'.padEnd(26)} | ${'E-MAIL'.padEnd(28)} | ${'TELEFONE'.padEnd(16)} | NASCIMENTO`
        );
        ConsoleUtils.divider();
        for (const c of clients) {
          const id = `#${c.clientId}`.padEnd(5);
          const name = (c.name.length > 24 ? c.name.substring(0, 21) + '...' : c.name).padEnd(26);
          const email = (c.email.length > 26 ? c.email.substring(0, 23) + '...' : c.email).padEnd(28);
          const phone = c.phone.padEnd(16);
          const birth = DateUtils.formatDate(c.birthDate);
          console.log(`${id} | ${name} | ${email} | ${phone} | ${birth}`);
        }
      }
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Consulta detalhada de cliente por identificador (RF09).
   */
  public async findClientById(): Promise<void> {
    ConsoleUtils.printHeader('Consulta de Cliente por ID');
    try {
      const id = await PromptUtils.askInt('Informe o ID do Cliente a pesquisar');
      const client = await this.clientService.getClientById(id);

      console.log(`\n${ConsoleUtils.BOLD}--- Detalhes do Cliente ---${ConsoleUtils.RESET}`);
      console.log(`${ConsoleUtils.CYAN}ID:${ConsoleUtils.RESET}            #${client.clientId}`);
      console.log(`${ConsoleUtils.CYAN}Nome:${ConsoleUtils.RESET}          ${client.name}`);
      console.log(`${ConsoleUtils.CYAN}E-mail:${ConsoleUtils.RESET}        ${client.email}`);
      console.log(`${ConsoleUtils.CYAN}Telefone:${ConsoleUtils.RESET}      ${client.phone}`);
      console.log(`${ConsoleUtils.CYAN}Nascimento:${ConsoleUtils.RESET}    ${DateUtils.formatDate(client.birthDate)}`);
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Atualização dos dados de um cliente existente (RF09).
   */
  public async updateClient(): Promise<void> {
    ConsoleUtils.printHeader('Atualização de Cliente');
    try {
      const id = await PromptUtils.askInt('Informe o ID do Cliente que deseja atualizar');
      const current = await this.clientService.getClientById(id);

      console.log(`\nEditando cliente: ${ConsoleUtils.BOLD}${current.name}${ConsoleUtils.RESET} (Pressione Enter para manter o valor atual)\n`);

      const name = await PromptUtils.askText('Novo Nome', current.name);
      const email = await PromptUtils.askText('Novo E-mail', current.email);
      const phone = await PromptUtils.askText('Novo Telefone', current.phone);
      const birthDate = await PromptUtils.askDate('Nova Data de Nascimento', current.birthDate);

      const updated = await this.clientService.updateClient(id, name, email, phone, birthDate);
      ConsoleUtils.success(`Cliente #${updated.clientId} atualizado com sucesso!`);
    } catch (err: unknown) {
      ConsoleUtils.error(err instanceof Error ? err.message : String(err));
    } finally {
      await PromptUtils.pause();
    }
  }

  /**
   * Remoção de um cliente do sistema (RF09).
   */
  public async deleteClient(): Promise<void> {
    ConsoleUtils.printHeader('Remoção de Cliente');
    try {
      const id = await PromptUtils.askInt('Informe o ID do Cliente que deseja remover');
      const client = await this.clientService.getClientById(id);

      const confirm = await PromptUtils.askConfirm(
        `Tem certeza que deseja remover o cliente "${client.name}" (ID #${client.clientId})?`
      );

      if (confirm) {
        await this.clientService.deleteClient(id);
        ConsoleUtils.success(`Cliente "${client.name}" removido com sucesso.`);
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
