export interface Organisation {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserOrganisation {
  id: string;
  role: 'admin' | 'member' | 'owner';
} 