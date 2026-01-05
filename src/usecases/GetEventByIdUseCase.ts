import { Event } from '../domain/entities/Event';
import { IEventRepository } from '../domain/interfaces/IEventRepository';

export class GetEventByIdUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string): Promise<Event | null> {
    if (!id || id.trim() === '') {
      throw new Error('Event ID is required');
    }

    return this.eventRepository.findById(id);
  }
}
