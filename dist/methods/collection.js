"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollection = void 0;
const getCollection = (res, database) => {
    if (database === undefined) {
        console.error('blyat', console.error);
        res.send('Unable to connect to mongoDB database').status(500);
        return null;
    }
    const collection = database.collection('movies');
    return collection;
};
exports.getCollection = getCollection;
