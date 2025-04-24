export interface SimpleUser {
  id: string;
  name: string | null;
  displayName: string | null;
}

export interface PostComment {
  id: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: SimpleUser;
}

export interface Tag {
  icon: string;
  name: string;
}

export interface Post {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  createdBy: SimpleUser;
  likedBy: string[];
  tags: Tag[];
  imageId: string | null;
  comments: PostComment[];
}
