"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const films_json_1 = __importDefault(require("./films.json"));
const port = 4000;
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.status(200).send('Connection established');
});
app.get('/films', (req, res) => {
    try {
        res.status(200).json(films_json_1.default);
    }
    catch (error) {
        console.log('Console: Unable to send', error);
        res.status(500).send('Unable to send');
    }
});
app.get('/films/:id', (req, res) => {
    const filteredFilm = films_json_1.default.filter(film => film.film_id === parseFloat(req.params.id));
    res.status(200).json(filteredFilm[0]);
});
app.listen(port, () => console.log('Server running on port', port));
