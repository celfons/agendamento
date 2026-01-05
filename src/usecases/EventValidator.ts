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
    if (availableSlots > maxParticipants) {
      throw new Error('Available slots cannot exceed maximum participants');
    }
  }

  static validateName(name?: string): void {
    if (!name || name.trim() === '') {
      throw new Error('Event name is required');
    }
  }

  static validateOrganizers(organizers?: string[]): void {
    if (!organizers || organizers.length === 0) {
      throw new Error('At least one organizer is required');
    }
  }

  static validateCreateEvent(event: Event): void {
    this.validateName(event.name);
    this.validateMaxParticipants(event.maxParticipants);
    this.validateAvailableSlots(event.availableSlots, event.maxParticipants);
    this.validateDate(event.date);
    this.validateOrganizers(event.organizers);
  }

  static validateUpdateEvent(eventData: Partial<Event>): void {
    if (eventData.date) {
      this.validateDate(eventData.date);
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
