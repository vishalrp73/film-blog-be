"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelatedFilms = void 0;
const randomiseFilms_1 = require("./randomiseFilms");
const scoreThreshold = 0.5;
const getRelatedFilms = (collection, chosenFilmId) => __awaiter(void 0, void 0, void 0, function* () {
    const films = yield collection.find({}).toArray();
    const chosenFilm = films.find(({ film_id }) => film_id === parseFloat(chosenFilmId));
    const { title, genre: genres, review_score: chosenReviewScore, } = chosenFilm !== null && chosenFilm !== void 0 ? chosenFilm : {};
    if (title && genres && chosenReviewScore) {
        // using first genre entry only as it carries more weight
        const firstGenreEntry = genres[0];
        const relatedByGenre = films.filter((film) => film.genre.includes(firstGenreEntry) && title !== film.title);
        const dirtyFilms = films.flatMap((film) => {
            const { review_score } = film;
            if (review_score === null)
                return;
            const upperReviewScore = chosenReviewScore + scoreThreshold;
            const lowerReviewScore = chosenReviewScore - scoreThreshold;
            if (review_score >= lowerReviewScore &&
                review_score <= upperReviewScore) {
                return film;
            }
        });
        const relatedByReviewScore = dirtyFilms.filter((film) => film !== undefined && title !== film.title);
        const allRelatedFilms = (0, randomiseFilms_1.randomiseFilms)([
            ...new Set([...relatedByGenre, ...relatedByReviewScore]),
        ]);
        return allRelatedFilms.slice(0, 5);
    }
    return undefined;
});
exports.getRelatedFilms = getRelatedFilms;
