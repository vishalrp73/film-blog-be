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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const CONNECTION_STRING = (_a = process.env.MONGO_CONNECTION_STRING) !== null && _a !== void 0 ? _a : '';
const client = new mongodb_1.MongoClient(CONNECTION_STRING);
const db = () => __awaiter(void 0, void 0, void 0, function* () {
    let conn;
    try {
        conn = yield client.connect();
    }
    catch (err) {
        console.error('suka', err);
    }
    return conn === null || conn === void 0 ? void 0 : conn.db('films');
});
exports.default = db;
