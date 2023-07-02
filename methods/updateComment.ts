import { Response } from 'express';
import { Collection } from 'mongodb';
import { Comment, MongoFilm } from '../types';
import { apiError } from './apiError';

type Params = { filmId: number; commentId: number };

export const updateCommentVote = async (
  collection: Collection<MongoFilm>,
  type: 'upvote' | 'downvote',
  res: Response,
  params: Params,
) => {
  const { filmId, commentId } = params;
  const [film] = await collection.find({ film_id: filmId }).toArray();
  const { comments } = film;
  const selectedComment = comments.find((comment) => comment._id === commentId);
  const positionOfComment = comments.findIndex(
    (comment) => comment._id === commentId,
  );

  if (selectedComment === undefined) {
    res.status(404).send('Comment does not exist');
    return;
  }

  const { _id, name, comment_text, timestamp, upvotes, downvotes } =
    selectedComment;
  const incrementedVote = type === 'upvote' ? upvotes + 1 : downvotes + 1;
  const updatedComment: Comment = {
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
    .findOneAndUpdate(
      { film_id: filmId },
      { $set: { comments: updatedCommentList } },
    )
    .then(() => res.status(201).send('Vote successful'))
    .catch((err) => apiError(err, res));
};
