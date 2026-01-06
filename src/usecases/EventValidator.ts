import { Event } from '../domain/entities/Event';

export class EventValidator {
  static validateDate(date: Date): void {
    if (new Date(date) < new Date()) {
      throw new Error('Event date must be in the future');
    }
  }

  static validateMaxParticipants(maxParticipants: number): void {
    if (maxParticipants <= 0) {
      throw new Error('Maximum participants must be greater than 0');
    }
  }

  static validateAvailableSlots(
    availableSlots: number,
    maxParticipants: number
  ): void {
    if (availableSlots < 0) {
      throw new Error('Available slots cannot be negative');
    }
    if (availableSlots > maxParticipants) {
      throw new Error('Available slots cannot exceed maximum participants');
    }
  }

  static validateTitle(title?: string): void {
    if (!title || title.trim() === '') {
      throw new Error('Event title is required');
    }
  }

  static validateCreateEvent(event: Event): void {
    this.validateTitle(event.title);
    this.validateMaxParticipants(event.maxParticipants);
    this.validateAvailableSlots(event.availableSlots, event.maxParticipants);
    this.validateDate(event.startTime);
  }

  static validateUpdateEvent(eventData: Partial<Event>): void {
    if (eventData.startTime) {
      this.validateDate(eventData.startTime);
    }

    if (eventData.maxParticipants !== undefined) {
      this.validateMaxParticipants(eventData.maxParticipants);
    }

    if (
      eventData.availableSlots !== undefined &&
      eventData.maxParticipants !== undefined
    ) {
      this.validateAvailableSlots(
        eventData.availableSlots,
        eventData.maxParticipants
      );
    }
  }
}
