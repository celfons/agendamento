import { describe, it, expect, beforeEach } from '@jest/globals';
import { RegisterGuestToEventUseCase } from '../RegisterGuestToEventUseCase';
import { IEventRegistrationRepository } from '../../domain/interfaces/IEventRegistrationRepository';
import { IEventRepository } from '../../domain/interfaces/IEventRepository';
import { IClientRepository } from '../../domain/interfaces/IClientRepository';
import { Event } from '../../domain/entities/Event';
import { Client } from '../../domain/entities/Client';
import { EventRegistration, RegistrationStatus } from '../../domain/entities/EventRegistration';

describe('RegisterGuestToEventUseCase', () => {
  let useCase: RegisterGuestToEventUseCase;
  let mockEventRegistrationRepository: jest.Mocked<IEventRegistrationRepository>;
  let mockEventRepository: jest.Mocked<IEventRepository>;
  let mockClientRepository: jest.Mocked<IClientRepository>;

  beforeEach(() => {
    mockEventRegistrationRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEventId: jest.fn(),
      findByUserId: jest.fn(),
      findByClientId: jest.fn(),
      findByEventAndUser: jest.fn(),
      findByEventAndClient: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      countByEventId: jest.fn(),
    } as any;

    mockEventRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockClientRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByPhone: jest.fn(),
      findByEmailOrPhone: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    useCase = new RegisterGuestToEventUseCase(
      mockEventRegistrationRepository,
      mockEventRepository,
      mockClientRepository
    );
  });

  it('should successfully register a new guest to a public event', async () => {
    const event: Event = {
      id: 'event123',
      name: 'Test Event',
      description: 'Test Description',
      date: new Date('2026-12-31'),
      location: 'Test Location',
      maxParticipants: 50,
      availableSlots: 10,
      organizers: ['organizer1'],
      isPublic: true,
      createdBy: 'user123',
    };

    const guestData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    };

    const newClient: Client = {
      id: 'client123',
      ...guestData,
    };

    const registration: EventRegistration = {
      id: 'registration123',
      eventId: 'event123',
      clientId: 'client123',
      status: RegistrationStatus.CONFIRMED,
    };

    mockEventRepository.findById.mockResolvedValue(event);
    mockClientRepository.findByEmailOrPhone.mockResolvedValue(null);
    mockClientRepository.create.mockResolvedValue(newClient);
    mockEventRegistrationRepository.create.mockResolvedValue(registration);
    mockEventRepository.update.mockResolvedValue({ ...event, availableSlots: 9 });

    const result = await useCase.execute('event123', guestData);

    expect(result).toEqual(registration);
    expect(mockEventRepository.findById).toHaveBeenCalledWith('event123');
    expect(mockClientRepository.findByEmailOrPhone).toHaveBeenCalledWith(guestData.email, guestData.phone);
    expect(mockClientRepository.create).toHaveBeenCalledWith(guestData);
    expect(mockEventRegistrationRepository.create).toHaveBeenCalledWith({
      eventId: 'event123',
      clientId: 'client123',
      status: RegistrationStatus.CONFIRMED,
    });
    expect(mockEventRepository.update).toHaveBeenCalledWith('event123', {
      availableSlots: 9,
    });
  });

  it('should reuse existing client if email or phone already exists', async () => {
    const event: Event = {
      id: 'event123',
      name: 'Test Event',
      description: 'Test Description',
      date: new Date('2026-12-31'),
      location: 'Test Location',
      maxParticipants: 50,
      availableSlots: 10,
      organizers: ['organizer1'],
      isPublic: true,
      createdBy: 'user123',
    };

    const guestData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    };

    const existingClient: Client = {
      id: 'client123',
      name: 'John',
      lastName: 'Smith',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    };

    const registration: EventRegistration = {
      id: 'registration123',
      eventId: 'event123',
      clientId: 'client123',
      status: RegistrationStatus.CONFIRMED,
    };

    mockEventRepository.findById.mockResolvedValue(event);
    mockClientRepository.findByEmailOrPhone.mockResolvedValue(existingClient);
    mockEventRegistrationRepository.findByEventAndClient.mockResolvedValue(null);
    mockEventRegistrationRepository.create.mockResolvedValue(registration);
    mockEventRepository.update.mockResolvedValue({ ...event, availableSlots: 9 });

    const result = await useCase.execute('event123', guestData);

    expect(result).toEqual(registration);
    expect(mockClientRepository.create).not.toHaveBeenCalled();
    expect(mockEventRegistrationRepository.create).toHaveBeenCalledWith({
      eventId: 'event123',
      clientId: 'client123',
      status: RegistrationStatus.CONFIRMED,
    });
  });

  it('should throw error if event does not exist', async () => {
    mockEventRepository.findById.mockResolvedValue(null);

    const guestData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    };

    await expect(useCase.execute('event123', guestData)).rejects.toThrow('Event not found');
  });

  it('should throw error if event is not public', async () => {
    const event: Event = {
      id: 'event123',
      name: 'Test Event',
      description: 'Test Description',
      date: new Date('2026-12-31'),
      location: 'Test Location',
      maxParticipants: 50,
      availableSlots: 10,
      organizers: ['organizer1'],
      isPublic: false,
      createdBy: 'user123',
    };

    mockEventRepository.findById.mockResolvedValue(event);

    const guestData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    };

    await expect(useCase.execute('event123', guestData)).rejects.toThrow(
      'This event is not open for public registration'
    );
  });

  it('should throw error if event has no available slots', async () => {
    const event: Event = {
      id: 'event123',
      name: 'Test Event',
      description: 'Test Description',
      date: new Date('2026-12-31'),
      location: 'Test Location',
      maxParticipants: 50,
      availableSlots: 0,
      organizers: ['organizer1'],
      isPublic: true,
      createdBy: 'user123',
    };

    mockEventRepository.findById.mockResolvedValue(event);

    const guestData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    };

    await expect(useCase.execute('event123', guestData)).rejects.toThrow(
      'No available slots for this event'
    );
  });

  it('should throw error if client is already registered for the event', async () => {
    const event: Event = {
      id: 'event123',
      name: 'Test Event',
      description: 'Test Description',
      date: new Date('2026-12-31'),
      location: 'Test Location',
      maxParticipants: 50,
      availableSlots: 10,
      organizers: ['organizer1'],
      isPublic: true,
      createdBy: 'user123',
    };

    const guestData = {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
    };

    const existingClient: Client = {
      id: 'client123',
      ...guestData,
    };

    const existingRegistration: EventRegistration = {
      id: 'registration123',
      eventId: 'event123',
      clientId: 'client123',
      status: RegistrationStatus.CONFIRMED,
    };

    mockEventRepository.findById.mockResolvedValue(event);
    mockClientRepository.findByEmailOrPhone.mockResolvedValue(existingClient);
    mockEventRegistrationRepository.findByEventAndClient.mockResolvedValue(existingRegistration);

    await expect(useCase.execute('event123', guestData)).rejects.toThrow(
      'A client with this email or phone is already registered for this event'
    );
  });
});
