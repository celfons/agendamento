export interface Event {
  id?: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  maxParticipants: number;
  availableSlots: number;
  organizers: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
