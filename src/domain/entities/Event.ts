export interface Event {
  id?: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  maxParticipants: number;
  availableSlots: number;
  createdAt?: Date;
  updatedAt?: Date;
}
