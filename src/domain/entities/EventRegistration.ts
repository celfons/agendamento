export enum RegistrationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}

export interface EventRegistration {
  id?: string;
  eventId: string;
  userId: string;
  status: RegistrationStatus;
  registeredAt?: Date;
  updatedAt?: Date;
}
