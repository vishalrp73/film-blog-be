"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logRequest = void 0;
const logRequest = (req, message) => {
    console.log(req.method, req.httpVersion, message);
};
exports.logRequest = logRequest;
