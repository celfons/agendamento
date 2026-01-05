import { IEventRepository } from '../domain/interfaces/IEventRepository';

export class DeleteEventUseCase {
  constructor(private eventRepository: IEventRepository) {}

  async execute(id: string): Promise<boolean> {
    if (!id || id.trim() === '') {
      throw new Error('Event ID is required');
    }

    return this.eventRepository.delete(id);
  }
}
