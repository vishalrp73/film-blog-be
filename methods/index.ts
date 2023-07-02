import { logRequest } from './logRequest';
import { getCollection } from './collection';
import { apiError } from './apiError';
import { sanitizeTerm } from './sanitizeTerm';
import { transformUppercase } from './transformUppercase';
import { updateCommentVote } from './updateComment';
import { randomiseFilms } from './randomiseFilms';
import { getRelatedFilms } from './getRelatedFilms';

export {
  logRequest,
  getCollection,
  apiError,
  sanitizeTerm,
  transformUppercase,
  updateCommentVote,
  randomiseFilms,
  getRelatedFilms,
};
