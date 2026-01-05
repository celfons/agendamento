import { Client } from '../../domain/entities/Client';
import { IClientRepository } from '../../domain/interfaces/IClientRepository';
import { ClientModel, IClientDocument } from '../database/ClientModel';

export class MongoClientRepository implements IClientRepository {
  async create(client: Client): Promise<Client> {
    const clientDoc = await ClientModel.create(client);
    return this.mapToEntity(clientDoc);
  }

  async findById(id: string): Promise<Client | null> {
    const clientDoc = await ClientModel.findById(id).exec();
    return clientDoc ? this.mapToEntity(clientDoc) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const clientDoc = await ClientModel.findOne({ email: email.toLowerCase() }).exec();
    return clientDoc ? this.mapToEntity(clientDoc) : null;
  }

  async findByPhone(phone: string): Promise<Client | null> {
    const clientDoc = await ClientModel.findOne({ phone }).exec();
    return clientDoc ? this.mapToEntity(clientDoc) : null;
  }

  async findByEmailOrPhone(email: string, phone: string): Promise<Client | null> {
    const clientDoc = await ClientModel.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phone }
      ]
    }).exec();
    return clientDoc ? this.mapToEntity(clientDoc) : null;
  }

  async update(id: string, client: Partial<Client>): Promise<Client | null> {
    const clientDoc = await ClientModel.findByIdAndUpdate(
      id,
      client,
      { new: true }
    ).exec();
    return clientDoc ? this.mapToEntity(clientDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ClientModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private mapToEntity(doc: IClientDocument): Client {
    return {
      id: doc._id.toString(),
      name: doc.name,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
