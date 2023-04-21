"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const films_json_1 = __importDefault(require("./films.json"));
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.PORT;
const fs = __importStar(require("fs"));
const testJSONFilePath = './duplicate-test-env.json';
const db_films_path = './films.json';
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.status(200).send('Connection established');
});
app.get('/films', (req, res) => {
    try {
        res.setHeader("Content-Type", 'application/json');
        res.writeHead(200);
        res.end(JSON.stringify(films_json_1.default));
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Unable to retrieve films');
    }
});
app.get('/films/:id', (req, res) => {
    const filteredFilm = films_json_1.default.find(film => film.film_id === parseFloat(req.params.id));
    if (filteredFilm === undefined) {
        res.status(500).send('Unable to find film from ID');
    }
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(filteredFilm));
});
app.get('/topFive', (req, res) => {
    const topFive = [
        'Apocalypse Now',
        'Uncut Gems',
        'Stalker',
        'Casino',
        'Fear and Loathing in Las Vegas'
    ];
    const collection = [];
    try {
        for (const title of topFive) {
            const retrieve = films_json_1.default.find(film => film.title === title);
            if (retrieve === undefined)
                return null;
            collection.push(retrieve);
        }
        res.status(200).send(JSON.stringify(collection));
    }
    catch (error) {
        res.status(500).send('Unable to find Top Five films');
    }
});
app.get('/genres', (req, res) => {
    const genreCollection = [];
    films_json_1.default.forEach(film => {
        film.genre.forEach(genre => {
            if (!genreCollection.includes(genre)) {
                genreCollection.push(genre);
            }
        });
    });
    res.status(200).send(JSON.stringify(genreCollection));
});
app.get('/artists', (req, res) => {
    const listOfArtists = [];
    films_json_1.default.forEach(film => {
        listOfArtists.push(film.director);
        film.writers.forEach(writer => listOfArtists.push(writer));
        film.cinematography.forEach(cinematographer => listOfArtists.push(cinematographer));
        film.soundtrack.forEach(musician => listOfArtists.push(musician));
        film.notable_actors.forEach(actor => listOfArtists.push(actor));
    });
    const filteredUniqueArtists = [...new Set(listOfArtists)];
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(filteredUniqueArtists));
});
app.get('/categories', (req, res) => {
    const categoryCollection = [];
    films_json_1.default.forEach(film => {
        film.special_category.forEach(category => categoryCollection.push(category));
    });
    const filteredUniqueCategories = [...new Set(categoryCollection)];
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(filteredUniqueCategories));
});
const capitaliseNames = (arr) => {
    return arr.map(name => {
        const capitalisedFirst = name.charAt(0).toUpperCase();
        const rest = name.slice(1).toLowerCase();
        return capitalisedFirst + rest;
    });
};
app.get('/artist/:artist', (req, res) => {
    const artistCollection = [];
    const artist = (capitaliseNames((req.params.artist).split(' '))).join(' ');
    if (!artist)
        res.status(404).send('No films associated to that artist');
    films_json_1.default.forEach(film => {
        if (film.director === artist) {
            artistCollection.push(film);
        }
        film.writers.forEach(writer => {
            if (writer === artist) {
                artistCollection.push(film);
            }
        });
        film.cinematography.forEach(cinematographer => {
            if (cinematographer === artist) {
                artistCollection.push(film);
            }
        });
        film.soundtrack.forEach(musician => {
            if (musician === artist) {
                artistCollection.push(film);
            }
        });
        film.notable_actors.forEach(actor => {
            if (actor === artist) {
                artistCollection.push(film);
            }
        });
    });
    const filteredUniqueArtistCollection = [...new Set(artistCollection)];
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(filteredUniqueArtistCollection));
});
app.get('/genres/:genre', (req, res) => {
    var _a;
    const firstLetter = (_a = req.params.genre.at(0)) === null || _a === void 0 ? void 0 : _a.toUpperCase();
    const restOfGenre = req.params.genre.slice(1);
    const genre = firstLetter + restOfGenre;
    const genreFilms = [];
    films_json_1.default.forEach(film => {
        film.genre.forEach(filmGenre => {
            if (filmGenre === genre) {
                genreFilms.push(film);
            }
        });
    });
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(genreFilms));
});
app.get('/categories/:category', (req, res) => {
    const category = req.params.category;
    const categoryFilms = [];
    films_json_1.default.forEach(film => {
        film.special_category.forEach(specialCategory => {
            if (specialCategory === category) {
                categoryFilms.push(film);
            }
        });
    });
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(categoryFilms));
});
app.get('/upvote/:filmId/:commentId', (req, res) => {
    try {
        let JSONfile = fs.readFileSync(db_films_path, 'utf-8');
        let films = JSON.parse(JSONfile);
        const filmId = parseFloat(req.params.filmId);
        const commentId = parseFloat(req.params.commentId);
        films.forEach(film => {
            if (film.film_id === filmId) {
                film.comments.forEach(comment => {
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
    }
    catch (error) {
        console.error(error);
        console.log('Upvote not accepted, check logs');
        res.status(500).send('Unable to upvote, try again soon');
    }
});
app.get('/downvote/:filmId/:commentId', (req, res) => {
    try {
        let JSONfile = fs.readFileSync(db_films_path, 'utf-8');
        let films = JSON.parse(JSONfile);
        const filmId = parseFloat(req.params.filmId);
        const commentId = parseFloat(req.params.commentId);
        films.forEach(film => {
            if (film.film_id === filmId) {
                film.comments.forEach(comment => {
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
    }
    catch (error) {
        console.error(error);
        console.log('Downvote not accepted, check logs');
        res.status(500).send('Unable to downvote, try again soon');
    }
});
app.listen(port, () => console.log('Server running on port', port));
