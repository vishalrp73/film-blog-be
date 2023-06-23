import type { Response } from 'express';
import type { Collection, Db } from 'mongodb';
import type { MongoFilm } from '../types';

export const getCollection = (
  res: Response,
  database?: Db,
): Collection<MongoFilm> | null => {
  if (database === undefined) {
    console.error('blyat', console.error);
    res.send('Unable to connect to mongoDB database').status(500);
    return null;
  }

  const collection = database.collection<MongoFilm>('movies');
  return collection;
};
