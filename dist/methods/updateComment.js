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
exports.updateCommentVote = void 0;
const apiError_1 = require("./apiError");
const updateCommentVote = (collection, type, res, params) => __awaiter(void 0, void 0, void 0, function* () {
    const { filmId, commentId } = params;
    const [film] = yield collection.find({ film_id: filmId }).toArray();
    const { comments } = film;
    const selectedComment = comments.find((comment) => comment._id === commentId);
    const positionOfComment = comments.findIndex((comment) => comment._id === commentId);
    if (selectedComment === undefined) {
        res.status(404).send('Comment does not exist');
        return;
    }
    const { _id, name, comment_text, timestamp, upvotes, downvotes } = selectedComment;
    const incrementedVote = type === 'upvote' ? upvotes + 1 : downvotes + 1;
    const updatedComment = {
        _id,
        name,
        comment_text,
        timestamp,
        upvotes: type === 'upvote' ? incrementedVote : upvotes,
        downvotes: type === 'downvote' ? incrementedVote : downvotes,
    };
    const updatedCommentList = comments;
    updatedCommentList.splice(positionOfComment, 1, updatedComment);
    collection
        .findOneAndUpdate({ film_id: filmId }, { $set: { comments: updatedCommentList } })
        .then(() => res.status(201).send('Vote successful'))
        .catch((err) => (0, apiError_1.apiError)(err, res));
});
exports.updateCommentVote = updateCommentVote;
