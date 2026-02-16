import type { Article } from "./article";

export interface Category {
    id: number;
    category_name: string;
    articles : Article[];

}
