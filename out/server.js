import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as url from "url";
import { deckManager } from "./deckManager.js";
import { accountManager } from "./accountManager.js";
import { gameManager } from "./gameManager.js";
let app = express();
app.use(express.json());
let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbfile = `${__dirname}database.db`;
let db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");
app.use('/deckManager', deckManager);
app.use('/accountManager', accountManager);
app.use('/gameManager', gameManager);
let port = 3000;
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
