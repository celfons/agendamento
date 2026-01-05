import { Group } from '../entities/Group';

export interface IGroupRepository {
  create(group: Group): Promise<Group>;
  findById(id: string): Promise<Group | null>;
  findAll(): Promise<Group[]>;
  findByMember(userId: string): Promise<Group[]>;
  update(id: string, group: Partial<Group>): Promise<Group | null>;
  delete(id: string): Promise<boolean>;
  addMember(groupId: string, userId: string): Promise<Group | null>;
  removeMember(groupId: string, userId: string): Promise<Group | null>;
  addAdmin(groupId: string, userId: string): Promise<Group | null>;
  removeAdmin(groupId: string, userId: string): Promise<Group | null>;
}
