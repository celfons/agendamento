export interface Event {
  id?: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  maxParticipants: number;
  availableSlots: number;
  organizers: string[];
  createdBy?: string; // User ID of creator
  groupId?: string; // Group that manages this event
  isPublic?: boolean; // Whether external users can register
  createdAt?: Date;
  updatedAt?: Date;
}
