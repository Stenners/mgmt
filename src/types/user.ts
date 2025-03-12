import { Organisation } from './organisation';

export interface UserData {
  id: string;
  email: string | null;
  displayName: string | null;
  createdAt: Date;
  lastLoginAt: Date;
  organisations: string[];
  organisationsData?: Organisation[];
} 