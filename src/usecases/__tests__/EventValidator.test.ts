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

  describe('validateTitle', () => {
    it('should throw error when title is undefined', () => {
      expect(() => EventValidator.validateTitle(undefined)).toThrow(
        'Event title is required'
      );
    });

    it('should throw error when title is empty string', () => {
      expect(() => EventValidator.validateTitle('')).toThrow(
        'Event title is required'
      );
    });

    it('should throw error when title is only whitespace', () => {
      expect(() => EventValidator.validateTitle('   ')).toThrow(
        'Event title is required'
      );
    });

    it('should not throw error when title is valid', () => {
      expect(() => EventValidator.validateTitle('Valid Event Title')).not.toThrow();
    });
  });

  describe('validateCreateEvent', () => {
    const validEvent: Event = {
      title: 'Test Event',
      description: 'Test Description',
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 90000000),
      location: 'Test Location',
      maxParticipants: 10,
      availableSlots: 10,
    };

    it('should not throw error for valid event', () => {
      expect(() => EventValidator.validateCreateEvent(validEvent)).not.toThrow();
    });

    it('should throw error when title is missing', () => {
      const invalidEvent = { ...validEvent, title: '' };
      expect(() => EventValidator.validateCreateEvent(invalidEvent)).toThrow(
        'Event title is required'
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

    it('should throw error when startTime is in the past', () => {
      const invalidEvent = { ...validEvent, startTime: new Date('2020-01-01') };
      expect(() => EventValidator.validateCreateEvent(invalidEvent)).toThrow(
        'Event date must be in the future'
      );
    });
  });

  describe('validateUpdateEvent', () => {
    it('should validate startTime when provided', () => {
      const pastDate = new Date('2020-01-01');
      expect(() => EventValidator.validateUpdateEvent({ startTime: pastDate })).toThrow(
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
        EventValidator.validateUpdateEvent({ startTime: futureDate, maxParticipants: 20 })
      ).not.toThrow();
    });
  });
});
