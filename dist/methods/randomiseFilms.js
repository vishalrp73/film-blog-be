"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomiseFilms = void 0;
const randomiseFilms = (films) => {
    for (let i = films.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = films[i];
        films[i] = films[j];
        films[j] = temp;
    }
    return films;
};
exports.randomiseFilms = randomiseFilms;
