import { IEventRegistrationRepository } from '../domain/interfaces/IEventRegistrationRepository';

export class ListEventRegistrationsUseCase {
  constructor(private eventRegistrationRepository: IEventRegistrationRepository) {}

  async execute(eventId: string) {
    return this.eventRegistrationRepository.findByEventId(eventId);
  }
}
