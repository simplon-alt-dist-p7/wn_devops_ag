import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("t_comments", { schema: "reader" })
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 1000 })
  description!: string;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at!: Date;

  @Column({ name: "article_id", type: "integer" })
  article_id!: number;
}
