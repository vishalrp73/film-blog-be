import express, { Express, Request, Response } from 'express';
import { Film } from './types';
const cors = require('cors');
import db_films from './films.json';
const port = 4000;

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Connection established');
});

app.get('/films', (req: Request, res: Response) => {
    try {
        res.status(200).json(db_films);
    } catch (error) {
        console.log('Console: Unable to send', error);
        res.status(500).send('Unable to send');
    }
});

app.get('/films/:id', (req: Request, res: Response) => {
    const filteredFilm: Film[] = db_films.filter(film => film.film_id === parseFloat(req.params.id));
    res.status(200).json(filteredFilm[0]);
})

app.listen(port, () => console.log('Server running on port', port));
