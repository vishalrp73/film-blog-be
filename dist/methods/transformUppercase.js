"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformUppercase = void 0;
const transformUppercase = (term) => {
    const splitTerm = decodeURIComponent(term).split(' ');
    const upperCased = splitTerm.map((word) => word.toUpperCase());
    return upperCased.join(' ');
};
exports.transformUppercase = transformUppercase;
