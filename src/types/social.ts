export interface Discussion {
  id: number;
  title: string;
  author: string;
  replies: number;
  participants: number;
  lastActive: string;
}

export interface DiscussionReply {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}