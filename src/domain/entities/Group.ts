export interface Group {
  id?: string;
  name: string;
  description: string;
  members: string[]; // User IDs
  admins: string[]; // User IDs who can manage this group
  createdBy: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
}
