import { IEventRegistrationRepository } from '../domain/interfaces/IEventRegistrationRepository';

export class ListEventRegistrationsUseCase {
  constructor(private eventRegistrationRepository: IEventRegistrationRepository) {}

  async executeByEvent(eventId: string) {
    return this.eventRegistrationRepository.findByEventId(eventId);
  }

  async executeByUser(userId: string) {
    return this.eventRegistrationRepository.findByUserId(userId);
  }
}
