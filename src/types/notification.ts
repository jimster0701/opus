import { type SimpleUser } from "./user";

export interface Notification {
  id: number;
  type: NotificationType;
  fromUserId: string;
  toUserId: string;
  postId?: number;
  commentId?: number;
  replyId?: number;
  interestId?: number;
  createdAt: Date;
  read: boolean;

  fromUser: SimpleUser;
  toUser: SimpleUser;
}

export enum NotificationType {
  LIKE_POST = "LIKE_POST",
  LIKE_COMMENT = "LIKE_COMMENT",
  LIKE_REPLY = "LIKE_REPLY",
  TAKE_INTEREST = "TAKE_INTEREST",
  FOLLOW = "FOLLOW",
}
