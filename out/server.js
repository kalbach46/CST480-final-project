import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as url from "url";
import path from "path";
import { deckManager } from "./deckManager.js";
import { accountManager } from "./accountManager.js";
import { gameManager } from "./gameManager.js";
let app = express();
app.use(express.json());
let tokens = {};
export function addToken(token, userid) {
    tokens[token] = userid;
}
export function verifyToken(token) {
    return tokens[token] != null;
}
export function getUser(token) {
    return tokens[token];
}
let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbfile = `${__dirname}database.db`;
let db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");
app.use('/api/deckManager', deckManager);
app.use('/api/accountManager', accountManager);
app.use('/api/gameManager', gameManager);
let port = 8008;
let host = "localhost";
let protocol = "http";
app.use(express.static("public"));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'out', 'public', 'index.html'));
});
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
