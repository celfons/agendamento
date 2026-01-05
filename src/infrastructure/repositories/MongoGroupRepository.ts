import { Group } from '../../domain/entities/Group';
import { IGroupRepository } from '../../domain/interfaces/IGroupRepository';
import { GroupModel, IGroupDocument } from '../database/GroupModel';

export class MongoGroupRepository implements IGroupRepository {
  async create(group: Group): Promise<Group> {
    const groupDoc = await GroupModel.create(group);
    return this.mapToEntity(groupDoc);
  }

  async findById(id: string): Promise<Group | null> {
    const groupDoc = await GroupModel.findById(id).exec();
    return groupDoc ? this.mapToEntity(groupDoc) : null;
  }

  async findAll(): Promise<Group[]> {
    const groupDocs = await GroupModel.find().exec();
    return groupDocs.map(doc => this.mapToEntity(doc));
  }

  async findByMember(userId: string): Promise<Group[]> {
    const groupDocs = await GroupModel.find({ members: userId }).exec();
    return groupDocs.map(doc => this.mapToEntity(doc));
  }

  async update(id: string, group: Partial<Group>): Promise<Group | null> {
    const groupDoc = await GroupModel.findByIdAndUpdate(id, group, { new: true }).exec();
    return groupDoc ? this.mapToEntity(groupDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await GroupModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async addMember(groupId: string, userId: string): Promise<Group | null> {
    const groupDoc = await GroupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    ).exec();
    return groupDoc ? this.mapToEntity(groupDoc) : null;
  }

  async removeMember(groupId: string, userId: string): Promise<Group | null> {
    const groupDoc = await GroupModel.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } },
      { new: true }
    ).exec();
    return groupDoc ? this.mapToEntity(groupDoc) : null;
  }

  async addAdmin(groupId: string, userId: string): Promise<Group | null> {
    const groupDoc = await GroupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { admins: userId } },
      { new: true }
    ).exec();
    return groupDoc ? this.mapToEntity(groupDoc) : null;
  }

  async removeAdmin(groupId: string, userId: string): Promise<Group | null> {
    const groupDoc = await GroupModel.findByIdAndUpdate(
      groupId,
      { $pull: { admins: userId } },
      { new: true }
    ).exec();
    return groupDoc ? this.mapToEntity(groupDoc) : null;
  }

  private mapToEntity(doc: IGroupDocument): Group {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      members: doc.members.map(m => m.toString()),
      admins: doc.admins.map(a => a.toString()),
      createdBy: doc.createdBy.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}
