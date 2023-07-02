import { Film } from '../types';

export const randomiseFilms = (films: Film[]): Film[] => {
  for (let i = films.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = films[i];
    films[i] = films[j];
    films[j] = temp;
  }
  return films;
};
