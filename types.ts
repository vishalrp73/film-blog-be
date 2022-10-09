export interface Comment {
    _id: number;
    name: string;
    comment_text: string;
    timestamp: Date;
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
    review_score: number;
    thumbnail: string;
    img_bank: string[];
    headline: string;
    comments: Comment[];
}