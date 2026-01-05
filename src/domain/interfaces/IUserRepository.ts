import { User } from '../entities/User';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  addToGroup(userId: string, groupId: string): Promise<User | null>;
  removeFromGroup(userId: string, groupId: string): Promise<User | null>;
  comparePassword(userId: string, password: string): Promise<boolean>;
}
