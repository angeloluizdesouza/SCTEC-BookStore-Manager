import { Client } from '../models/Client';
import { IClientRepository } from './IClientRepository';

/**
 * Repositório em memória para persistência de clientes.
 */
export class ClientRepository implements IClientRepository {
  private clients: Map<number, Client> = new Map();
  private currentId: number = 0;

  public async create(client: Client): Promise<Client> {
    if (client.clientId <= 0) {
      this.currentId += 1;
      client.clientId = this.currentId;
    } else if (client.clientId > this.currentId) {
      this.currentId = client.clientId;
    }
    this.clients.set(client.clientId, client);
    return client;
  }

  public async findAll(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  public async findById(id: number): Promise<Client | null> {
    return this.clients.get(id) ?? null;
  }

  public async findByEmail(email: string): Promise<Client | null> {
    const normalized = email.trim().toLowerCase();
    for (const c of this.clients.values()) {
      if (c.email.trim().toLowerCase() === normalized) {
        return c;
      }
    }
    return null;
  }

  public async update(client: Client): Promise<Client> {
    if (!this.clients.has(client.clientId)) {
      throw new Error(`Cliente com ID ${client.clientId} não encontrado no repositório.`);
    }
    this.clients.set(client.clientId, client);
    return client;
  }

  public async delete(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }

  public async getNextId(): Promise<number> {
    return this.currentId + 1;
  }
}
