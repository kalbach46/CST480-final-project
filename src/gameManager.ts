import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from './server.js';
import cookieParser from "cookie-parser";
import { getUser } from './server.js';


let router = express.Router();
router.use(express.json());
router.use(cookieParser());
router.use((req, res, next) => {
    if(!verifyToken(req.cookies.token)){
        res.set({'Set-Cookie':[`loggedIn=false; Path=/`]});
        res.send("invalid token");
        return;
    }
    res.locals.userid = getUser(req.cookies.token);
    next();
})

export let db = await open({filename: "../database.db",driver: sqlite3.Database,});
await db.get("PRAGMA foreign_keys = ON");



async function getUserStat(userId : string) : Promise<any>{
    const stats = await db.get("select * from user_stat where id = ?",[userId]);
    return [stats.wins, stats.total]
}

router.put('/win', async(req, res) =>{ // Not secure, user can modify this | need a special com
    const userid = res.locals.userid;
    const [userWins, userTotal] = await getUserStat(userid);
    

    // Update stats
    const updateStatement = await db.prepare("update user_stat set wins = ?, total = ? where id = ?");
    await updateStatement.bind([userWins+1, userTotal+1, userid]);

    try {
        await updateStatement.run();
        res.json({ message: "Success" });
    }catch (e){
        res.status(500).json({ error: "Server ERROR" });
    }
})

router.put('/lose', async(req, res) =>{ // Not secure, user can modify this | need a special com
    const userid = res.locals.userid;
    const [_, userTotal] = await getUserStat(userid);

    // Update stats
    const updateStatement = await db.prepare("update user_stat set total = ? where id = ?");
    await updateStatement.bind([userTotal+1, userid]);

    try {
        await updateStatement.run();
        res.json({ message: "Success" });
    }catch (e){
        res.status(500).json({ error: "Server ERROR" });
    }
})

router.get("/stats", async(req, res)=>{
    const userid = res.locals.userid;
    const [userWin, userTotal] = await getUserStat(userid);
    return res.json({win : userWin, total : userTotal});
})


export const gameManager = router;