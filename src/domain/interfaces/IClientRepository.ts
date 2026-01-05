import { Client } from '../entities/Client';

export interface IClientRepository {
  create(client: Client): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  findByPhone(phone: string): Promise<Client | null>;
  findByEmailOrPhone(email: string, phone: string): Promise<Client | null>;
  update(id: string, client: Partial<Client>): Promise<Client | null>;
  delete(id: string): Promise<boolean>;
}
