import { CreateEventUseCase } from '../CreateEventUseCase';
import { IEventRepository } from '../../domain/interfaces/IEventRepository';
import { Event } from '../../domain/entities/Event';

describe('CreateEventUseCase', () => {
  let createEventUseCase: CreateEventUseCase;
  let mockEventRepository: jest.Mocked<IEventRepository>;

  beforeEach(() => {
    // Create a mock repository
    mockEventRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    createEventUseCase = new CreateEventUseCase(mockEventRepository);
  });

  const validEventData: Event = {
    title: 'Test Event',
    description: 'Test Description',
    startTime: new Date(Date.now() + 86400000), // tomorrow
    endTime: new Date(Date.now() + 90000000),
    location: 'Test Location',
    maxParticipants: 10,
    availableSlots: 10,
  };

  describe('execute', () => {
    it('should create event when data is valid', async () => {
      const expectedEvent: Event = { ...validEventData, id: '123' };
      mockEventRepository.create.mockResolvedValue(expectedEvent);

      const result = await createEventUseCase.execute(validEventData);

      expect(mockEventRepository.create).toHaveBeenCalledWith(validEventData);
      expect(result).toEqual(expectedEvent);
    });

    it('should throw error when event title is missing', async () => {
      const invalidEvent = { ...validEventData, title: '' };

      await expect(createEventUseCase.execute(invalidEvent)).rejects.toThrow(
        'Event title is required'
      );
      expect(mockEventRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when maxParticipants is invalid', async () => {
      const invalidEvent = { ...validEventData, maxParticipants: 0 };

      await expect(createEventUseCase.execute(invalidEvent)).rejects.toThrow(
        'Maximum participants must be greater than 0'
      );
      expect(mockEventRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when startTime is in the past', async () => {
      const invalidEvent = { ...validEventData, startTime: new Date('2020-01-01') };

      await expect(createEventUseCase.execute(invalidEvent)).rejects.toThrow(
        'Event date must be in the future'
      );
      expect(mockEventRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when availableSlots exceeds maxParticipants', async () => {
      const invalidEvent = { ...validEventData, availableSlots: 15 };

      await expect(createEventUseCase.execute(invalidEvent)).rejects.toThrow(
        'Available slots cannot exceed maximum participants'
      );
      expect(mockEventRepository.create).not.toHaveBeenCalled();
    });
  });
});
