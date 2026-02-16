import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ArticleMV } from './ArticleMV.js';

@Entity({ schema: 'reader', name: 't_article_favorite' })
export class Favorite {
  @PrimaryGeneratedColumn({ name: 'id_favorite' })
  idFavorite!: number;

  @Column({ type: 'timestamp', name: 'date' })
  date!: Date | null;

  @Column({ name: 'id_article', type: 'int', unique: true })
  idArticle!: number;

  @ManyToOne(() => ArticleMV, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_article' })
  article!: ArticleMV;
}