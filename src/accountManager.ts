import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as url from "url";
import argon2 from "argon2";
import crypto from "crypto";
import {v4 as uuidv4} from 'uuid';
import { addToken } from './server.js';

const router = express.Router();


let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbfile = `${__dirname}database.db`;
let db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");

//DB LOGIC
async function addUser(id:string, username:string, password:string){
    password = await argon2.hash(password);
    let statement = await db.prepare(
        'INSERT INTO users(id, username, password) VALUES(?, ?, ?)'
    );
    await statement.bind([
        id,
        username, password
    ]);
    return await statement.run();
}

//VALIDATION
async function usernameIsUnique(username:string){
    let statement = await db.prepare(
        `SELECT * FROM users WHERE username=?`
    );
    await statement.bind(
        username
    );
    let out = await statement.all();
    return out.length==0;
}

router.post('/register', async (req, res) => {
    let username:string = req.body.username;
    let password:string = req.body.password;
    if(!await usernameIsUnique(username)){
        return res.status(400).json({ error : "username is already in use"});
    }
    let uuid = uuidv4();
    addUser(uuid, username, password).then(() => {
        res.status(200).send("user created successfully");
    })
})

router.put('/login', async (req, res) => {
    let password:string = req.body.password;
    let username:string = req.body.username;

    let statement = await db.prepare(
        'SELECT * FROM users WHERE username=?'
    );
    await statement.bind([username]);
    let user = await statement.get();
    await statement.finalize();
    if(!user){
        return res.status(400).json({error: "no user exists with that username"});
    }
    let hashed_pass = user.password;
    if(await argon2.verify(hashed_pass, password)){
        let token = crypto.randomBytes(16).toString('hex');
        addToken(token);
        res.set({'Set-Cookie':[`loggedIn=true; Path=/`, `token=${token}; httponly; Path=/`]});
        return res.json({token:token});
    } else {
        res.status(400).json({error: "password is incorrect"});
    }
})

export const accountManager = router;