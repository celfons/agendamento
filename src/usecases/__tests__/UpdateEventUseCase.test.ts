import { UpdateEventUseCase } from '../UpdateEventUseCase';
import { IEventRepository } from '../../domain/interfaces/IEventRepository';
import { Event } from '../../domain/entities/Event';

describe('UpdateEventUseCase', () => {
  let updateEventUseCase: UpdateEventUseCase;
  let mockEventRepository: jest.Mocked<IEventRepository>;

  beforeEach(() => {
    mockEventRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    updateEventUseCase = new UpdateEventUseCase(mockEventRepository);
  });

  const existingEvent: Event = {
    id: '123',
    title: 'Existing Event',
    description: 'Existing Description',
    startTime: new Date(Date.now() + 86400000),
    endTime: new Date(Date.now() + 90000000),
    location: 'Existing Location',
    maxParticipants: 10,
    availableSlots: 5,
  };

  describe('execute', () => {
    it('should update event successfully with valid data', async () => {
      const updateData: Partial<Event> = {
        title: 'Updated Event',
        description: 'Updated Description',
      };

      mockEventRepository.findById.mockResolvedValue(existingEvent);
      const updatedEvent = { ...existingEvent, ...updateData };
      mockEventRepository.update.mockResolvedValue(updatedEvent);

      const result = await updateEventUseCase.execute('123', updateData);

      expect(mockEventRepository.findById).toHaveBeenCalledWith('123');
      expect(mockEventRepository.update).toHaveBeenCalledWith('123', updateData);
      expect(result).toEqual(updatedEvent);
    });

    it('should throw error when event ID is empty', async () => {
      await expect(updateEventUseCase.execute('', {})).rejects.toThrow('Event ID is required');
      expect(mockEventRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw error when event ID is whitespace', async () => {
      await expect(updateEventUseCase.execute('   ', {})).rejects.toThrow('Event ID is required');
      expect(mockEventRepository.findById).not.toHaveBeenCalled();
    });

    it('should return null when event is not found', async () => {
      mockEventRepository.findById.mockResolvedValue(null);

      const result = await updateEventUseCase.execute('999', { title: 'New Title' });

      expect(result).toBeNull();
      expect(mockEventRepository.update).not.toHaveBeenCalled();
    });

    it('should validate startTime when provided in update', async () => {
      const pastDate = new Date('2020-01-01');
      mockEventRepository.findById.mockResolvedValue(existingEvent);

      await expect(
        updateEventUseCase.execute('123', { startTime: pastDate })
      ).rejects.toThrow('Event date must be in the future');
      expect(mockEventRepository.update).not.toHaveBeenCalled();
    });

    it('should validate maxParticipants when provided in update', async () => {
      mockEventRepository.findById.mockResolvedValue(existingEvent);

      await expect(
        updateEventUseCase.execute('123', { maxParticipants: 0 })
      ).rejects.toThrow('Maximum participants must be greater than 0');
      expect(mockEventRepository.update).not.toHaveBeenCalled();
    });

    it('should validate availableSlots against existing maxParticipants', async () => {
      mockEventRepository.findById.mockResolvedValue(existingEvent);

      await expect(
        updateEventUseCase.execute('123', { availableSlots: 15 })
      ).rejects.toThrow('Available slots cannot exceed maximum participants');
      expect(mockEventRepository.update).not.toHaveBeenCalled();
    });

    it('should validate availableSlots against new maxParticipants', async () => {
      mockEventRepository.findById.mockResolvedValue(existingEvent);

      await expect(
        updateEventUseCase.execute('123', { availableSlots: 15, maxParticipants: 10 })
      ).rejects.toThrow('Available slots cannot exceed maximum participants');
      expect(mockEventRepository.update).not.toHaveBeenCalled();
    });

    it('should allow valid partial update', async () => {
      const updateData: Partial<Event> = {
        availableSlots: 8,
        maxParticipants: 20,
      };

      mockEventRepository.findById.mockResolvedValue(existingEvent);
      const updatedEvent = { ...existingEvent, ...updateData };
      mockEventRepository.update.mockResolvedValue(updatedEvent);

      const result = await updateEventUseCase.execute('123', updateData);

      expect(result).toEqual(updatedEvent);
      expect(mockEventRepository.update).toHaveBeenCalledWith('123', updateData);
    });

    it('should allow updating availableSlots within existing maxParticipants', async () => {
      const updateData: Partial<Event> = { availableSlots: 8 };

      mockEventRepository.findById.mockResolvedValue(existingEvent);
      const updatedEvent = { ...existingEvent, ...updateData };
      mockEventRepository.update.mockResolvedValue(updatedEvent);

      const result = await updateEventUseCase.execute('123', updateData);

      expect(result).toEqual(updatedEvent);
    });

    it('should propagate repository errors', async () => {
      mockEventRepository.findById.mockResolvedValue(existingEvent);
      mockEventRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(
        updateEventUseCase.execute('123', { title: 'New Title' })
      ).rejects.toThrow('Database error');
    });
  });
});
