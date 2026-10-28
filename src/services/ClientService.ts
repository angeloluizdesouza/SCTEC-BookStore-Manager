import { Client } from '../models/Client';
import { IClientRepository } from '../repositories/IClientRepository';
import { ILoanRepository } from '../repositories/ILoanRepository';
import { ValidationUtils } from '../utils/ValidationUtils';

/**
 * Serviço responsável pelas regras de negócio e validações da entidade Cliente.
 */
export class ClientService {
  constructor(
    private readonly clientRepo: IClientRepository,
    private readonly loanRepo: ILoanRepository
  ) {}

  public async createClient(
    name: string,
    email: string,
    phone: string,
    birthDate: Date
  ): Promise<Client> {
    if (!ValidationUtils.isNotEmpty(name)) {
      throw new Error('O nome do cliente é obrigatório.');
    }
    if (!ValidationUtils.isValidEmail(email)) {
      throw new Error('E-mail informado possui formato inválido.');
    }
    const existing = await this.clientRepo.findByEmail(email);
    if (existing) {
      throw new Error(`Já existe um cliente cadastrado com o e-mail "${email}".`);
    }
    if (!ValidationUtils.isValidPhone(phone)) {
      throw new Error('Telefone informado é inválido.');
    }
    if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
      throw new Error('Data de nascimento inválida.');
    }
    if (birthDate.getTime() > Date.now()) {
      throw new Error('A data de nascimento não pode estar no futuro.');
    }

    const nextId = await this.clientRepo.getNextId();
    const client = new Client(
      nextId,
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      birthDate
    );

    return await this.clientRepo.create(client);
  }

  public async getAllClients(): Promise<Client[]> {
    const list = await this.clientRepo.findAll();
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }

  public async getClientById(id: number): Promise<Client> {
    if (!ValidationUtils.isValidId(id)) {
      throw new Error('ID do cliente deve ser um número inteiro positivo.');
    }
    const client = await this.clientRepo.findById(id);
    if (!client) {
      throw new Error(`Cliente com ID #${id} não foi encontrado.`);
    }
    return client;
  }

  public async updateClient(
    id: number,
    name: string,
    email: string,
    phone: string,
    birthDate: Date
  ): Promise<Client> {
    const client = await this.getClientById(id);

    if (!ValidationUtils.isNotEmpty(name)) {
      throw new Error('O nome do cliente não pode ser vazio.');
    }
    if (!ValidationUtils.isValidEmail(email)) {
      throw new Error('E-mail informado é inválido.');
    }

    const emailOwner = await this.clientRepo.findByEmail(email);
    if (emailOwner && emailOwner.clientId !== id) {
      throw new Error(`O e-mail "${email}" já está em uso por outro cliente.`);
    }

    if (!ValidationUtils.isValidPhone(phone)) {
      throw new Error('Telefone informado é inválido.');
    }
    if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
      throw new Error('Data de nascimento inválida.');
    }
    if (birthDate.getTime() > Date.now()) {
      throw new Error('A data de nascimento não pode estar no futuro.');
    }

    client.name = name.trim();
    client.email = email.trim().toLowerCase();
    client.phone = phone.trim();
    client.birthDate = birthDate;

    return await this.clientRepo.update(client);
  }

  public async deleteClient(id: number): Promise<void> {
    const client = await this.getClientById(id);
    const activeLoans = await this.loanRepo.findActiveByClientId(client.clientId);
    if (activeLoans.length > 0) {
      throw new Error(
        `Não é possível remover o cliente "${client.name}" pois ele possui ${activeLoans.length} empréstimo(s) ativo(s) pendente(s) de devolução.`
      );
    }
    await this.clientRepo.delete(id);
  }
}
