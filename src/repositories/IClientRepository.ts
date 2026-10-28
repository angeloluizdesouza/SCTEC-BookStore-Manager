import { Client } from '../models/Client';

export interface IClientRepository {
  create(client: Client): Promise<Client>;
  findAll(): Promise<Client[]>;
  findById(id: number): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  update(client: Client): Promise<Client>;
  delete(id: number): Promise<boolean>;
  getNextId(): Promise<number>;
}
