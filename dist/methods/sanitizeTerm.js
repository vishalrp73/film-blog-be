"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeTerm = void 0;
const sanitizeTerm = (term) => {
    const splitTerm = decodeURIComponent(term).split(' ');
    const firstLetters = splitTerm.map((word) => word.charAt(0).toUpperCase());
    const restOfLetters = splitTerm.map((word) => word.slice(1));
    const Uppercased = firstLetters.map((letter, index) => `${letter}${restOfLetters[index]}`);
    return Uppercased.join(' ');
};
exports.sanitizeTerm = sanitizeTerm;
