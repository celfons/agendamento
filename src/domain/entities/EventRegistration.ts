export enum RegistrationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export interface EventRegistration {
  id?: string;
  eventId: string;
  userId?: string; // For authenticated users
  clientId?: string; // For guest clients (non-authenticated)
  status: RegistrationStatus;
  registeredAt?: Date;
  updatedAt?: Date;
}
