export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  USER = 'user'
}

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  groups?: string[]; // Group IDs
  createdAt?: Date;
  updatedAt?: Date;
}
