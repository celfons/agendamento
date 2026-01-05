import { IGroupRepository } from '../domain/interfaces/IGroupRepository';

export class ListGroupsUseCase {
  constructor(private groupRepository: IGroupRepository) {}

  async execute(userId?: string) {
    if (userId) {
      // Return groups where user is a member
      return this.groupRepository.findByMember(userId);
    }
    // Return all groups
    return this.groupRepository.findAll();
  }
}
