import { IGroupRepository } from '../domain/interfaces/IGroupRepository';
import { IUserRepository } from '../domain/interfaces/IUserRepository';

export class AddUserToGroupUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(groupId: string, userId: string, requesterId: string): Promise<void> {
    // Check if group exists
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    // Check if requester is an admin of the group
    if (!group.admins.includes(requesterId)) {
      throw new Error('Only group admins can add members');
    }

    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Add user to group
    await this.groupRepository.addMember(groupId, userId);
    await this.userRepository.addToGroup(userId, groupId);
  }
}
