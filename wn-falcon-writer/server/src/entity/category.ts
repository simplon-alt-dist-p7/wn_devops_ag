import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Article } from "./article.js";

@Entity({ schema: "writer", name: "t_category" })
export class Category {

    @PrimaryGeneratedColumn({name: "id_category"})
    id!: number;

    @Column({ type: "varchar", length: 100, unique: true })
    category_name!: string;

    @OneToMany(() => Article, article => article.category)
    articles!: Article[];
}