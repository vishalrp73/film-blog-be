"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomNumber = void 0;
const getRandomNumber = (length) => {
    const randomNumber = Math.random() * length;
    return Math.floor(randomNumber);
};
exports.getRandomNumber = getRandomNumber;
