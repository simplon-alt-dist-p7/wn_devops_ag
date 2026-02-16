import type { Comment } from "./comment";

export interface Article {
  id: number;
  title: string;
  subtitle: string;
  summary: string;
  content: string;
  published_at: string;
  comment_count: number;
  comments: Comment[];
  category_name?: string;
  is_favorite: boolean;
}
