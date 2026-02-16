import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
  schema: "reader",
  name: "mv_articles",
  materialized: true,
})
export class ArticleMV {
  @ViewColumn()
  id!: number;

  @ViewColumn()
  title!: string;

  @ViewColumn()
  subtitle!: string;

  @ViewColumn()
  summary!: string;

  @ViewColumn()
  content!: string;

  @ViewColumn()
  published_at!: Date;

  @ViewColumn()
  category_name!: string;

  @ViewColumn({ name: "comment_count" })
  comment_count!: number;

  @ViewColumn({ name: "is_favorite" })
  is_favorite!: boolean;
}
