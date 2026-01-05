import { Group } from '../domain/entities/Group';
import { IGroupRepository } from '../domain/interfaces/IGroupRepository';
import { IUserRepository } from '../domain/interfaces/IUserRepository';

export class CreateGroupUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(groupData: Omit<Group, 'id'>, creatorId: string): Promise<Group> {
    // Verify creator exists
    const creator = await this.userRepository.findById(creatorId);
    if (!creator) {
      throw new Error('Creator not found');
    }

    // Ensure creator is in admins list
    const admins = groupData.admins.includes(creatorId) 
      ? groupData.admins 
      : [...groupData.admins, creatorId];

    // Ensure creator is in members list
    const members = groupData.members.includes(creatorId)
      ? groupData.members
      : [...groupData.members, creatorId];

    const group = await this.groupRepository.create({
      ...groupData,
      createdBy: creatorId,
      admins,
      members,
    });

    // Add group to user's groups
    await this.userRepository.addToGroup(creatorId, group.id!);

    return group;
  }
}
