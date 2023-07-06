import { WithId } from 'mongodb';

export interface Comment {
  _id: number;
  name: string;
  comment_text: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
}

export interface Film {
  title: string;
  film_id: number;
  director: string;
  year: number;
  runtime: string;
  genre: string[];
  writers: string[];
  cinematography: string[];
  soundtrack: string[];
  notable_actors: string[];
  blurb: string;
  special_category: string[];
  tags: string[];
  trailer: string;
  trivia: string[];
  review_text: string;
  review_score: number | null;
  thumbnail: string;
  img_bank: string[];
  headline: string;
  comments: Comment[];
  justWatchId?: number;
}

export type MongoFilm = WithId<Document> & Film;

export type Artists = {
  directors: string[];
  writers: string[];
  cinematographers: string[];
  musicians: string[];
  actors: string[];
};
