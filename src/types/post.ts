export interface SimpleUser {
  id: string;
  name: string | null;
  displayName: string | null;
}

export interface Post {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: SimpleUser;
  likes: number;
}
