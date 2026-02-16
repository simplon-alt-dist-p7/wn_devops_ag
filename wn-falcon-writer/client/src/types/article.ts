import type { Category } from "./category";

export interface Article {
    id: number;
    title: string;
    subtitle: string;
    summary: string;
    content: string;
    published_at: string;
    updated_at: string;
    deleted_at: string | null;
    category: Category;
}
