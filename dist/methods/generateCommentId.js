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
exports.generateCommentId = void 0;
const generateCommentId = (collection, filmId) => __awaiter(void 0, void 0, void 0, function* () {
    const [film] = yield collection.find({ film_id: filmId }).toArray();
    const { comments } = film;
    if (comments.length === 0) {
        return 1;
    }
    const lastCommentId = comments.map(({ _id }) => _id).slice(-1);
    const lastId = lastCommentId[0];
    const iteratedId = lastId + 1;
    return iteratedId;
});
exports.generateCommentId = generateCommentId;
