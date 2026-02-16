import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.js";

@Entity({ schema: "writer", name: "t_articles" })
export class Article {
  @PrimaryGeneratedColumn({ name: "id_article"})
  id!: number;

  @Column({ type: "varchar", length: 300, unique: true })
  title!: string;

  @Column({ type: "varchar", length: 300 })
  subtitle!: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  published_at!: Date;

  @Column({
    type: "timestamp",
    nullable: true,
  })
  deleted_at!: Date | null;

  @Column({type: "timestamp", nullable: true})
  updated_at!: Date | null;

  @Column({ type: "varchar", length: 1000 })
  summary!: string;

  @Column({ type: "varchar", length: 10000 })
  content!: string;

  @ManyToOne(() => Category, category => category.articles, {
    nullable: false,
    onDelete: "CASCADE"
  })

  @JoinColumn({ name: "id_category" })
  category!: Partial<Category>;

  get published_at_fr(): string {
    return this.published_at.toLocaleString("fr-FR").replace(",", "");
  }
}
