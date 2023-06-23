"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiError = void 0;
const apiError = (err, res) => {
    console.error('suka', err);
    res.send('API ERROR').status(500);
};
exports.apiError = apiError;
