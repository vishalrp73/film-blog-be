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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = require('dotenv').config();
const cors = require('cors');
const conn_js_1 = __importDefault(require("./server/db/conn.js"));
const routes_js_1 = require("./routes.js");
const methods_1 = require("./methods");
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// '/' root
app.get(routes_js_1.routes.root, (req, res) => {
    (0, methods_1.logRequest)(req, 'Incoming connection received');
    res.send('Connected to API successfully').status(200);
});
// Films endpoints
// '/films'
app.get(routes_js_1.routes.films, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, methods_1.logRequest)(req, 'All films requested');
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        const films = yield collection.find({}).toArray();
        res.send(films).status(200);
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
}));
// '/films/:id'
app.get(`${routes_js_1.routes.films}/:id`, (req, res) => {
    const filmId = req.params.id;
    (0, methods_1.logRequest)(req, `Film with ID of ${filmId} requested`);
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        const film = yield collection
            .find({ film_id: parseFloat(filmId) })
            .toArray();
        if (film) {
            res.send(film[0]).status(200);
            return;
        }
        res.send('Unable to find film').status(404);
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
});
// Top 5 Films
// '/topFive'
app.get(routes_js_1.routes.topFive, (req, res) => {
    (0, methods_1.logRequest)(req, 'Top 5 Films requested');
    const topFive = [
        'Apocalypse Now',
        'Uncut Gems',
        'Stalker',
        'Casino',
        'Miami Vice',
    ];
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        const films = yield collection
            .find({ title: { $in: topFive } })
            .toArray();
        if (films.length > 0) {
            res.send(films).status(200);
            return;
        }
        res.send('Unable to find Top 5 films').status(404);
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
});
// Genres endpoints
// '/genres'
app.get(`${routes_js_1.routes.genres}`, (req, res) => {
    (0, methods_1.logRequest)(req, 'All genres requested');
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        const films = yield collection.find({}).toArray();
        const genreCollection = [...new Set(films.flatMap((film) => film.genre))];
        if (genreCollection.length > 0) {
            res.send(JSON.stringify(genreCollection)).status(200);
            return;
        }
        res.send('Unable to find genres').status(404);
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
});
// '/genres/:genre'
app.get(`${routes_js_1.routes.genres}/:genre`, (req, res) => {
    const { genre } = req.params;
    (0, methods_1.logRequest)(req, `${genre} requested`);
    const sanitizedGenre = (0, methods_1.sanitizeTerm)(genre);
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        const films = yield collection.find({ genre: sanitizedGenre }).toArray();
        if (films) {
            res.send(films).status(200);
            return;
        }
        res.send('Unable to find films of that genre').status(404);
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
});
// Artists endpoints
// '/artists'
// app.get(`${routes.artists}`, (req: Request, res: Response) => {
//   logRequest(req, 'All artists requested');
//   db()
//     .then(async (database) => {
//       const collection = getCollection(res, database);
//       if (collection === null) return;
//       const films = await collection.find({}).toArray();
//       const artists = [
//         ...new Set(
//           films.flatMap(
//             ({
//               director,
//               writers,
//               cinematography,
//               soundtrack,
//               notable_actors,
//             }) => [
//               director,
//               ...writers,
//               ...cinematography,
//               ...soundtrack,
//               ...notable_actors,
//             ],
//           ),
//         ),
//       ];
//       if (artists.length > 0) {
//         res.send(artists).status(200);
//         return;
//       }
//       res.send('Unable to find any artists').status(404);
//     })
//     .catch((err) => apiError(err, res));
// });
// mock test - getting artists and having them sorted by role
// app.get(`${routes.artists}`, (req: Request, res: Response) => {
//   console.log('hit mock endpoint');
//   const directors = mockDb.map(({ director }) => director);
//   const writers = mockDb.flatMap(({ writers }) =>
//     writers.map((writer) => writer),
//   );
//   const cinematography = mockDb.flatMap(({ cinematography }) =>
//     cinematography.map((cinematographer) => cinematographer),
//   );
//   const soundtrack = mockDb.flatMap(({ soundtrack }) =>
//     soundtrack.map((musician) => musician),
//   );
//   const actors = mockDb.flatMap(({ notable_actors }) =>
//     notable_actors.map((actor) => actor),
//   );
//   type Artists = {
//     directors: string[];
//     writers: string[];
//     cinematography: string[];
//     soundtrack: string[];
//     actors: string[];
//   };
//   const artists: Artists = {
//     directors,
//     writers,
//     cinematography,
//     soundtrack,
//     actors,
//   };
//   res.send(artists).status(200);
// });
// rebuilt
app.get(`${routes_js_1.routes.artists}`, (req, res) => {
    (0, methods_1.logRequest)(req, 'All artists requested');
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        const films = yield collection.find({}).toArray();
        const directors = [...new Set(films.map(({ director }) => director))];
        const writers = [
            ...new Set(films.flatMap(({ writers }) => writers.map((writer) => writer))),
        ];
        const cinematographers = [
            ...new Set(films.flatMap(({ cinematography }) => cinematography.map((cinematographer) => cinematographer))),
        ];
        const musicians = [
            ...new Set(films.flatMap(({ soundtrack }) => soundtrack.map((musician) => musician))),
        ];
        const actors = [
            ...new Set(films.flatMap(({ notable_actors }) => notable_actors.map((actor) => actor))),
        ];
        const artists = {
            directors,
            writers,
            cinematographers,
            musicians,
            actors,
        };
        if (artists) {
            res.send(artists).status(200);
            return;
        }
        res.send('Unable to find any artists').status(404);
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
});
// '/artists/:artist'
app.get(`${routes_js_1.routes.artists}/:artist`, (req, res) => {
    const { artist } = req.params;
    (0, methods_1.logRequest)(req, `${artist} requested`);
    const sanitizedArtist = (0, methods_1.sanitizeTerm)(artist);
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        const films = yield collection
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
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
});
// Categories endpoints
// '/categories'
app.get(routes_js_1.routes.categories, (req, res) => {
    (0, methods_1.logRequest)(req, 'All categories requested');
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        const films = yield collection.find({}).toArray();
        const categories = [
            ...new Set(films.flatMap(({ special_category }) => special_category)),
        ];
        if (categories.length > 0) {
            res.send(categories).status(200);
            return;
        }
        res.send('Unable to find any categories').status(404);
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
});
// '/categories/:category'
app.get(`${routes_js_1.routes.categories}/:category`, (req, res) => {
    const { category } = req.params;
    (0, methods_1.logRequest)(req, `${category} requested`);
    const sanitizedCategory = (0, methods_1.transformUppercase)(category);
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        const films = yield collection
            .find({ special_category: sanitizedCategory })
            .toArray();
        if (films.length > 0) {
            res.send(films).status(200);
            return;
        }
        res.send('Unable to find any films for that category').status(404);
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
});
// Comment endpoints
// '/addComment/:film_id'
app.post(`${routes_js_1.routes.addComment}/:id`, (req, res) => {
    const { body } = req;
    const { id } = req.params;
    (0, methods_1.logRequest)(req, `${id} requested to comment`);
    const { _id, name, comment_text, timestamp, upvotes, downvotes } = body;
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = yield (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        const commentToAdd = {
            _id,
            name,
            comment_text,
            timestamp,
            upvotes,
            downvotes,
        };
        collection
            .findOneAndUpdate({ film_id: parseFloat(id) }, { $push: { comments: commentToAdd } })
            .then(() => res.status(201).send('Successfully added comment'))
            .catch((err) => (0, methods_1.apiError)(err, res));
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
});
// '/upvote/:film_id/comment_id'
app.get(`${routes_js_1.routes.upvote}/:id/:commentId`, (req, res) => {
    const { id, commentId } = req.params;
    (0, methods_1.logRequest)(req, `${id} requested to upvote ${commentId}`);
    const params = { filmId: parseFloat(id), commentId: parseFloat(commentId) };
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        (0, methods_1.updateCommentVote)(collection, 'upvote', res, params);
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
});
// '/downvote/:film_id/:comment_id'
app.get(`${routes_js_1.routes.downvote}/:id/:commentId`, (req, res) => {
    const { id, commentId } = req.params;
    (0, methods_1.logRequest)(req, `${id} requested to downvote ${commentId}`);
    const params = { filmId: parseFloat(id), commentId: parseFloat(commentId) };
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = yield (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        (0, methods_1.updateCommentVote)(collection, 'downvote', res, params);
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
});
// Related films endpoint
// '/related/:id'
app.get('/related/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, methods_1.logRequest)(req, `${id} requested related films`);
    (0, conn_js_1.default)()
        .then((database) => __awaiter(void 0, void 0, void 0, function* () {
        const collection = yield (0, methods_1.getCollection)(res, database);
        if (collection === null)
            return;
        const relatedFilms = yield (0, methods_1.getRelatedFilms)(collection, id);
        if (relatedFilms === undefined) {
            res.status(404).send(`Unable to find related films for ${id}`);
            console.log(`Cannot find related films for ${id}`);
        }
        res.status(200).send(relatedFilms);
        return;
    }))
        .catch((err) => (0, methods_1.apiError)(err, res));
}));
app.listen(PORT, () => console.log('Server running at port', PORT));
