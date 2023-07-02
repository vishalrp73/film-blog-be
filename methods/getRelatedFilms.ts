import { Collection } from 'mongodb';
import { Film, MongoFilm } from '../types';
import { randomiseFilms } from './randomiseFilms';

const scoreThreshold = 0.5;

export const getRelatedFilms = async (
  collection: Collection<MongoFilm>,
  chosenFilmId: string,
) => {
  const films = await collection.find({}).toArray();
  const chosenFilm = films.find(
    ({ film_id }) => film_id === parseFloat(chosenFilmId),
  );

  const {
    title,
    genre: genres,
    review_score: chosenReviewScore,
  } = chosenFilm ?? {};

  if (title && genres && chosenReviewScore) {
    // using first genre entry only as it carries more weight
    const firstGenreEntry = genres[0];
    const relatedByGenre = films.filter(
      (film) => film.genre.includes(firstGenreEntry) && title !== film.title,
    );
    const dirtyFilms = films.flatMap((film) => {
      const { review_score } = film;
      if (review_score === null) return;
      const upperReviewScore = chosenReviewScore + scoreThreshold;
      const lowerReviewScore = chosenReviewScore - scoreThreshold;

      if (
        review_score >= lowerReviewScore &&
        review_score <= upperReviewScore
      ) {
        return film;
      }
    });

    const relatedByReviewScore = dirtyFilms.filter(
      (film) => film !== undefined && title !== film.title,
    ) as Film[];
    const allRelatedFilms = randomiseFilms([
      ...new Set([...relatedByGenre, ...relatedByReviewScore]),
    ]);
    return allRelatedFilms.slice(0, 5);
  }

  return undefined;
};
