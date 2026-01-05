import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserModel, IUserDocument } from '../database/UserModel';

export class MongoUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const userDoc = await UserModel.create(user);
    return this.mapToEntity(userDoc);
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id).exec();
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email }).exec();
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async findAll(): Promise<User[]> {
    const userDocs = await UserModel.find().exec();
    return userDocs.map(doc => this.mapToEntity(doc));
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const userDoc = await UserModel.findByIdAndUpdate(id, user, { new: true }).exec();
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async addToGroup(userId: string, groupId: string): Promise<User | null> {
    const userDoc = await UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { groups: groupId } },
      { new: true }
    ).exec();
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async removeFromGroup(userId: string, groupId: string): Promise<User | null> {
    const userDoc = await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { groups: groupId } },
      { new: true }
    ).exec();
    return userDoc ? this.mapToEntity(userDoc) : null;
  }

  async comparePassword(userId: string, password: string): Promise<boolean> {
    const userDoc = await UserModel.findById(userId);
    if (!userDoc) {
      return false;
    }
    return userDoc.comparePassword(password);
  }

  private mapToEntity(doc: IUserDocument): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      groups: doc.groups?.map(g => g.toString()),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
