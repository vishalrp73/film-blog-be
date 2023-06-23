import express, { Express, Request, Response } from 'express';
const dotenv = require('dotenv').config();
const cors = require('cors');
import db from './server/db/conn.js';
import { routes } from './routes.js';
import {
  logRequest,
  getCollection,
  apiError,
  sanitizeTerm,
  transformUppercase,
} from './methods';
const PORT = process.env.PORT;

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// '/' root
app.get(routes.root, (req: Request, res: Response) => {
  logRequest(req, 'Incoming connection received');
  res.send('Connected to API successfully').status(200);
});

// Films endpoints
// '/films'
app.get(routes.films, async (req: Request, res: Response) => {
  logRequest(req, 'All films requested');

  db()
    .then(async (database) => {
      const collection = getCollection(res, database);
      if (collection === null) return;

      const films = await collection.find({}).toArray();
      res.send(films).status(200);
    })
    .catch((err) => apiError(err, res));
});

// '/films/:id'
app.get(`${routes.films}/:id`, (req: Request, res: Response) => {
  const filmId = req.params.id;
  logRequest(req, `Film with ID of ${filmId} requested`);

  db()
    .then(async (database) => {
      const collection = getCollection(res, database);
      if (collection === null) return;

      const film = await collection
        .find({ film_id: parseFloat(filmId) })
        .toArray();

      if (film) {
        res.send(film[0]).status(200);
        return;
      }

      res.send('Unable to find film').status(404);
    })
    .catch((err) => apiError(err, res));
});

// Top 5 Films
// '/topFive'
app.get(routes.topFive, (req: Request, res: Response) => {
  logRequest(req, 'Top 5 Films requested');
  const topFive = [
    'Apocalypse Now',
    'Uncut Gems',
    'Stalker',
    'Casino',
    'Miami Vice',
  ];
  db()
    .then(async (database) => {
      const collection = getCollection(res, database);
      if (collection === null) return;

      const films = await collection
        .find({ title: { $in: topFive } })
        .toArray();

      if (films.length > 0) {
        res.send(films).status(200);
        return;
      }

      res.send('Unable to find Top 5 films').status(404);
    })
    .catch((err) => apiError(err, res));
});

// Genres endpoints
// '/genres'
app.get(`${routes.genres}`, (req: Request, res: Response) => {
  logRequest(req, 'All genres requested');
  db()
    .then(async (database) => {
      const collection = getCollection(res, database);
      if (collection === null) return;

      const films = await collection.find({}).toArray();
      const genreCollection = [...new Set(films.flatMap((film) => film.genre))];

      if (genreCollection.length > 0) {
        res.send(JSON.stringify(genreCollection)).status(200);
        return;
      }

      res.send('Unable to find genres').status(404);
    })
    .catch((err) => apiError(err, res));
});

// '/genres/:genre'
app.get(`${routes.genres}/:genre`, (req: Request, res: Response) => {
  const { genre } = req.params;
  logRequest(req, `${genre} requested`);
  const sanitizedGenre = sanitizeTerm(genre);

  db()
    .then(async (database) => {
      const collection = getCollection(res, database);
      if (collection === null) return;

      const films = await collection.find({ genre: sanitizedGenre }).toArray();
      if (films) {
        res.send(films).status(200);
        return;
      }

      res.send('Unable to find films of that genre').status(404);
    })
    .catch((err) => apiError(err, res));
});

// Artists endpoints
// '/artists/:artist'
app.get(`${routes.artists}`, (req: Request, res: Response) => {
  logRequest(req, 'All artists requested');
  db()
    .then(async (database) => {
      const collection = getCollection(res, database);
      if (collection === null) return;

      const films = await collection.find({}).toArray();
      const artists = [
        ...new Set(
          films.flatMap(
            ({
              director,
              writers,
              cinematography,
              soundtrack,
              notable_actors,
            }) => [
              director,
              ...writers,
              ...cinematography,
              ...soundtrack,
              ...notable_actors,
            ],
          ),
        ),
      ];

      if (artists.length > 0) {
        res.send(artists).status(200);
        return;
      }

      res.send('Unable to find any artists').status(404);
    })
    .catch((err) => apiError(err, res));
});

// '/artists/:artist'
app.get(`${routes.artists}/:artist`, (req: Request, res: Response) => {
  const { artist } = req.params;
  logRequest(req, `${artist} requested`);
  const sanitizedArtist = sanitizeTerm(artist);

  db()
    .then(async (database) => {
      const collection = getCollection(res, database);
      if (collection === null) return;

      const films = await collection
        .find({
          $or: [
            { director: sanitizedArtist },
            { writers: sanitizedArtist },
            { cinematography: sanitizedArtist },
            { soundtrack: sanitizedArtist },
            { notable_actors: sanitizedArtist },
          ],
        })
        .toArray();

      if (films.length > 0) {
        res.send(films).status(200);
        return;
      }

      res.send('Unable to find films by that artist').status(404);
    })
    .catch((err) => apiError(err, res));
});

// Categories endpoints
// '/categories'
app.get(routes.categories, (req: Request, res: Response) => {
  logRequest(req, 'All categories requested');
  db()
    .then(async (database) => {
      const collection = getCollection(res, database);
      if (collection === null) return;

      const films = await collection.find({}).toArray();
      const categories = [
        ...new Set(films.flatMap(({ special_category }) => special_category)),
      ];

      if (categories.length > 0) {
        res.send(categories).status(200);
        return;
      }

      res.send('Unable to find any categories').status(404);
    })
    .catch((err) => apiError(err, res));
});

// '/categories/:category'
app.get(`${routes.categories}/:category`, (req: Request, res: Response) => {
  const { category } = req.params;
  logRequest(req, `${category} requested`);
  const sanitizedCategory = transformUppercase(category);

  db()
    .then(async (database) => {
      const collection = getCollection(res, database);
      if (collection === null) return;

      const films = await collection
        .find({ special_category: sanitizedCategory })
        .toArray();

      if (films.length > 0) {
        res.send(films).status(200);
        return;
      }

      res.send('Unable to find any films for that category').status(404);
    })
    .catch((err) => apiError(err, res));
});

app.listen(PORT, () => console.log('Server running at port', PORT));
