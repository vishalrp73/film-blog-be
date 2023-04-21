import express, { Express, Request, Response } from 'express';
import { Film } from './types';
import db_films from './films.json';
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.PORT;

import * as fs from 'fs';

import testJSON from './duplicate-test-env.json';

const testJSONFilePath = './duplicate-test-env.json';
const db_films_path = './films.json';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Connection established');
});

app.get('/films', (req: Request, res: Response) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(db_films));
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to retrieve films');
  }
});

app.get('/films/:id', (req: Request, res: Response) => {
  const filteredFilm: Film | undefined = db_films.find(
    (film) => film.film_id === parseFloat(req.params.id),
  );
  if (filteredFilm === undefined) {
    res.status(500).send('Unable to find film from ID');
  }
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(filteredFilm));
});

app.get('/topFive', (req: Request, res: Response) => {
  const topFive = [
    'Apocalypse Now',
    'Uncut Gems',
    'Stalker',
    'Casino',
    'Fear and Loathing in Las Vegas',
  ];

  const collection: Film[] = [];

  try {
    for (const title of topFive) {
      const retrieve = db_films.find((film) => film.title === title);
      if (retrieve === undefined) return null;
      collection.push(retrieve);
    }

    res.status(200).send(JSON.stringify(collection));
  } catch (error) {
    res.status(500).send('Unable to find Top Five films');
  }
});

app.get('/genres', (req: Request, res: Response) => {
  const genreCollection: string[] = [];
  db_films.forEach((film) => {
    film.genre.forEach((genre) => {
      if (!genreCollection.includes(genre)) {
        genreCollection.push(genre);
      }
    });
  });
  res.status(200).send(JSON.stringify(genreCollection));
});

app.get('/artists', (req: Request, res: Response) => {
  const listOfArtists: string[] = [];
  db_films.forEach((film) => {
    listOfArtists.push(film.director);
    film.writers.forEach((writer) => listOfArtists.push(writer));
    film.cinematography.forEach((cinematographer) =>
      listOfArtists.push(cinematographer),
    );
    film.soundtrack.forEach((musician) => listOfArtists.push(musician));
    film.notable_actors.forEach((actor) => listOfArtists.push(actor));
  });
  const filteredUniqueArtists = [...new Set(listOfArtists)];

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(filteredUniqueArtists));
});

app.get('/categories', (req: Request, res: Response) => {
  const categoryCollection: string[] = [];
  db_films.forEach((film) => {
    film.special_category.forEach((category) =>
      categoryCollection.push(category),
    );
  });
  const filteredUniqueCategories = [...new Set(categoryCollection)];

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(filteredUniqueCategories));
});

const capitaliseNames = (arr: string[]): string[] => {
  return arr.map((name) => {
    const capitalisedFirst = name.charAt(0).toUpperCase();
    const rest = name.slice(1).toLowerCase();
    return capitalisedFirst + rest;
  });
};

app.get('/artist/:artist', (req: Request, res: Response) => {
  const artistCollection: Film[] = [];

  const artist = capitaliseNames(req.params.artist.split(' ')).join(' ');

  if (!artist) res.status(404).send('No films associated to that artist');

  db_films.forEach((film) => {
    if (film.director === artist) {
      artistCollection.push(film);
    }
    film.writers.forEach((writer) => {
      if (writer === artist) {
        artistCollection.push(film);
      }
    });
    film.cinematography.forEach((cinematographer) => {
      if (cinematographer === artist) {
        artistCollection.push(film);
      }
    });
    film.soundtrack.forEach((musician) => {
      if (musician === artist) {
        artistCollection.push(film);
      }
    });
    film.notable_actors.forEach((actor) => {
      if (actor === artist) {
        artistCollection.push(film);
      }
    });
  });

  const filteredUniqueArtistCollection = [...new Set(artistCollection)];

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(filteredUniqueArtistCollection));
});

app.get('/genres/:genre', (req: Request, res: Response) => {
  const firstLetter = req.params.genre.at(0)?.toUpperCase();
  const restOfGenre = req.params.genre.slice(1);
  const genre = firstLetter + restOfGenre;

  const genreFilms: Film[] = [];
  db_films.forEach((film) => {
    film.genre.forEach((filmGenre) => {
      if (filmGenre === genre) {
        genreFilms.push(film);
      }
    });
  });
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(genreFilms));
});

app.get('/categories/:category', (req: Request, res: Response) => {
  const category = req.params.category;
  const categoryFilms: Film[] = [];

  db_films.forEach((film) => {
    film.special_category.forEach((specialCategory) => {
      if (specialCategory === category) {
        categoryFilms.push(film);
      }
    });
  });

  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify(categoryFilms));
});

app.get('/upvote/:filmId/:commentId', (req: Request, res: Response) => {
  try {
    let JSONfile = fs.readFileSync(db_films_path, 'utf-8');
    let films: Film[] = JSON.parse(JSONfile);

    const filmId = parseFloat(req.params.filmId);
    const commentId = parseFloat(req.params.commentId);

    films.forEach((film) => {
      if (film.film_id === filmId) {
        film.comments.forEach((comment) => {
          if (comment._id === commentId) {
            comment.upvotes++;
          }
        });
      }
    });

    JSONfile = JSON.stringify(films);

    fs.writeFileSync(db_films_path, JSONfile, 'utf-8');
    console.log('Upvote successful');
    res.status(200).send('Successfully upvoted');
  } catch (error) {
    console.error(error);
    console.log('Upvote not accepted, check logs');
    res.status(500).send('Unable to upvote, try again soon');
  }
});

app.get('/downvote/:filmId/:commentId', (req: Request, res: Response) => {
  try {
    let JSONfile = fs.readFileSync(db_films_path, 'utf-8');
    let films: Film[] = JSON.parse(JSONfile);

    const filmId = parseFloat(req.params.filmId);
    const commentId = parseFloat(req.params.commentId);

    films.forEach((film) => {
      if (film.film_id === filmId) {
        film.comments.forEach((comment) => {
          if (comment._id === commentId) {
            comment.downvotes++;
          }
        });
      }
    });

    console.log(films[0]);
    JSONfile = JSON.stringify(films);

    fs.writeFileSync(db_films_path, JSONfile, 'utf-8');
    res.status(200).send('Successfully downvoted');
    console.log('Downvote successful');
  } catch (error) {
    console.error(error);
    console.log('Downvote not accepted, check logs');
    res.status(500).send('Unable to downvote, try again soon');
  }
});

app.listen(port, () => console.log('Server running on port', port));
