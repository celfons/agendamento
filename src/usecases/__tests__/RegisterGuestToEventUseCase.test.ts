import { describe, it, expect, beforeEach } from '@jest/globals';
import { RegisterGuestToEventUseCase } from '../RegisterGuestToEventUseCase';
import { IEventRegistrationRepository } from '../../domain/interfaces/IEventRegistrationRepository';
import { IEventRepository } from '../../domain/interfaces/IEventRepository';
import { Event } from '../../domain/entities/Event';
import { EventRegistration } from '../../domain/entities/EventRegistration';

describe('RegisterGuestToEventUseCase', () => {
  let useCase: RegisterGuestToEventUseCase;
  let mockEventRegistrationRepository: jest.Mocked<IEventRegistrationRepository>;
  let mockEventRepository: jest.Mocked<IEventRepository>;

  beforeEach(() => {
    mockEventRegistrationRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEventId: jest.fn(),
      findByEventAndPhone: jest.fn(),
      deleteByEventAndPhone: jest.fn(),
      countByEventId: jest.fn(),
    } as any;

    mockEventRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    useCase = new RegisterGuestToEventUseCase(
      mockEventRegistrationRepository,
      mockEventRepository
    );
  });

  it('should successfully register a new guest to an event', async () => {
    const event: Event = {
      id: 'event123',
      title: 'Test Event',
      description: 'Test Description',
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 90000000),
      location: 'Test Location',
      maxParticipants: 50,
      availableSlots: 10,
    };

    const guestData = {
      name: 'John Doe',
      phone: '+1234567890',
    };

    const registration: EventRegistration = {
      id: 'registration123',
      eventId: 'event123',
      name: 'John Doe',
      phone: '+1234567890',
    };

    mockEventRepository.findById.mockResolvedValue(event);
    mockEventRegistrationRepository.findByEventAndPhone.mockResolvedValue(null);
    mockEventRegistrationRepository.create.mockResolvedValue(registration);
    mockEventRepository.update.mockResolvedValue({ ...event, availableSlots: 9 });

    const result = await useCase.execute('event123', guestData);

    expect(result).toEqual(registration);
    expect(mockEventRepository.findById).toHaveBeenCalledWith('event123');
    expect(mockEventRegistrationRepository.findByEventAndPhone).toHaveBeenCalledWith('event123', guestData.phone);
    expect(mockEventRegistrationRepository.create).toHaveBeenCalledWith({
      eventId: 'event123',
      name: 'John Doe',
      phone: '+1234567890',
    });
    expect(mockEventRepository.update).toHaveBeenCalledWith('event123', {
      availableSlots: 9,
    });
  });

  it('should throw error if event does not exist', async () => {
    mockEventRepository.findById.mockResolvedValue(null);

    const guestData = {
      name: 'John Doe',
      phone: '+1234567890',
    };

    await expect(useCase.execute('event123', guestData)).rejects.toThrow('Event not found');
  });

  it('should throw error if phone is already registered for the event', async () => {
    const event: Event = {
      id: 'event123',
      title: 'Test Event',
      description: 'Test Description',
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 90000000),
      location: 'Test Location',
      maxParticipants: 50,
      availableSlots: 10,
    };

    const guestData = {
      name: 'John Doe',
      phone: '+1234567890',
    };

    const existingRegistration: EventRegistration = {
      id: 'registration123',
      eventId: 'event123',
      name: 'John Doe',
      phone: '+1234567890',
    };

    mockEventRepository.findById.mockResolvedValue(event);
    mockEventRegistrationRepository.findByEventAndPhone.mockResolvedValue(existingRegistration);

    await expect(useCase.execute('event123', guestData)).rejects.toThrow(
      'This phone number is already registered for this event'
    );
  });

  it('should throw error if event has no available slots', async () => {
    const event: Event = {
      id: 'event123',
      title: 'Test Event',
      description: 'Test Description',
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 90000000),
      location: 'Test Location',
      maxParticipants: 50,
      availableSlots: 0,
    };

    mockEventRepository.findById.mockResolvedValue(event);

    const guestData = {
      name: 'John Doe',
      phone: '+1234567890',
    };

    await expect(useCase.execute('event123', guestData)).rejects.toThrow(
      'No available slots for this event'
    );
  });
});
