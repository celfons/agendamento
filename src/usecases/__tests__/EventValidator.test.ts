import { EventValidator } from '../EventValidator';
import { Event } from '../../domain/entities/Event';

describe('EventValidator', () => {
  describe('validateDate', () => {
    it('should throw error when date is in the past', () => {
      const pastDate = new Date('2020-01-01');
      expect(() => EventValidator.validateDate(pastDate)).toThrow(
        'Event date must be in the future'
      );
    });

    it('should not throw error when date is in the future', () => {
      const futureDate = new Date(Date.now() + 86400000); // tomorrow
      expect(() => EventValidator.validateDate(futureDate)).not.toThrow();
    });
  });

  describe('validateMaxParticipants', () => {
    it('should throw error when maxParticipants is 0', () => {
      expect(() => EventValidator.validateMaxParticipants(0)).toThrow(
        'Maximum participants must be greater than 0'
      );
    });

    it('should throw error when maxParticipants is negative', () => {
      expect(() => EventValidator.validateMaxParticipants(-1)).toThrow(
        'Maximum participants must be greater than 0'
      );
    });

    it('should not throw error when maxParticipants is positive', () => {
      expect(() => EventValidator.validateMaxParticipants(10)).not.toThrow();
    });
  });

  describe('validateAvailableSlots', () => {
    it('should throw error when availableSlots is negative', () => {
      expect(() => EventValidator.validateAvailableSlots(-1, 10)).toThrow(
        'Available slots cannot be negative'
      );
    });

    it('should throw error when availableSlots exceeds maxParticipants', () => {
      expect(() => EventValidator.validateAvailableSlots(15, 10)).toThrow(
        'Available slots cannot exceed maximum participants'
      );
    });

    it('should not throw error when availableSlots is valid', () => {
      expect(() => EventValidator.validateAvailableSlots(5, 10)).not.toThrow();
    });

    it('should not throw error when availableSlots equals maxParticipants', () => {
      expect(() => EventValidator.validateAvailableSlots(10, 10)).not.toThrow();
    });
  });

  describe('validateName', () => {
    it('should throw error when name is undefined', () => {
      expect(() => EventValidator.validateName(undefined)).toThrow(
        'Event name is required'
      );
    });

    it('should throw error when name is empty string', () => {
      expect(() => EventValidator.validateName('')).toThrow(
        'Event name is required'
      );
    });

    it('should throw error when name is only whitespace', () => {
      expect(() => EventValidator.validateName('   ')).toThrow(
        'Event name is required'
      );
    });

    it('should not throw error when name is valid', () => {
      expect(() => EventValidator.validateName('Valid Event Name')).not.toThrow();
    });
  });

  describe('validateOrganizers', () => {
    it('should throw error when organizers is undefined', () => {
      expect(() => EventValidator.validateOrganizers(undefined)).toThrow(
        'At least one organizer is required'
      );
    });

    it('should throw error when organizers is empty array', () => {
      expect(() => EventValidator.validateOrganizers([])).toThrow(
        'At least one organizer is required'
      );
    });

    it('should not throw error when organizers has at least one element', () => {
      expect(() => EventValidator.validateOrganizers(['organizer1'])).not.toThrow();
    });
  });

  describe('validateCreateEvent', () => {
    const validEvent: Event = {
      name: 'Test Event',
      description: 'Test Description',
      date: new Date(Date.now() + 86400000),
      location: 'Test Location',
      maxParticipants: 10,
      availableSlots: 10,
      organizers: ['organizer1'],
    };

    it('should not throw error for valid event', () => {
      expect(() => EventValidator.validateCreateEvent(validEvent)).not.toThrow();
    });

    it('should throw error when name is missing', () => {
      const invalidEvent = { ...validEvent, name: '' };
      expect(() => EventValidator.validateCreateEvent(invalidEvent)).toThrow(
        'Event name is required'
      );
    });

    it('should throw error when maxParticipants is invalid', () => {
      const invalidEvent = { ...validEvent, maxParticipants: 0 };
      expect(() => EventValidator.validateCreateEvent(invalidEvent)).toThrow(
        'Maximum participants must be greater than 0'
      );
    });

    it('should throw error when availableSlots exceeds maxParticipants', () => {
      const invalidEvent = { ...validEvent, availableSlots: 15 };
      expect(() => EventValidator.validateCreateEvent(invalidEvent)).toThrow(
        'Available slots cannot exceed maximum participants'
      );
    });

    it('should throw error when date is in the past', () => {
      const invalidEvent = { ...validEvent, date: new Date('2020-01-01') };
      expect(() => EventValidator.validateCreateEvent(invalidEvent)).toThrow(
        'Event date must be in the future'
      );
    });

    it('should throw error when organizers are missing', () => {
      const invalidEvent = { ...validEvent, organizers: [] };
      expect(() => EventValidator.validateCreateEvent(invalidEvent)).toThrow(
        'At least one organizer is required'
      );
    });
  });

  describe('validateUpdateEvent', () => {
    it('should validate date when provided', () => {
      const pastDate = new Date('2020-01-01');
      expect(() => EventValidator.validateUpdateEvent({ date: pastDate })).toThrow(
        'Event date must be in the future'
      );
    });

    it('should validate maxParticipants when provided', () => {
      expect(() => EventValidator.validateUpdateEvent({ maxParticipants: 0 })).toThrow(
        'Maximum participants must be greater than 0'
      );
    });

    it('should validate availableSlots when both slots and max are provided', () => {
      expect(() =>
        EventValidator.validateUpdateEvent({ availableSlots: 15, maxParticipants: 10 })
      ).toThrow('Available slots cannot exceed maximum participants');
    });

    it('should not throw error for valid partial update', () => {
      const futureDate = new Date(Date.now() + 86400000);
      expect(() =>
        EventValidator.validateUpdateEvent({ date: futureDate, maxParticipants: 20 })
      ).not.toThrow();
    });
  });
});
