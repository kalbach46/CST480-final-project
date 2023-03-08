import { DeckSchema, DeckPOSTRequestBody, DeckPutRequestBody,DECK_SIZE } from './deckManager.type.js'
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

const ALLOWED_NUM_DECKS = 5;
const MAX_DUPLICATE = 2;

router.post("/deck", async (req: DeckPOSTRequestBody, res: any) =>{
    const deckBody = DeckSchema.safeParse(req.body);
    if (!deckBody.success){ // Should be handled better in UI
        return res.status(400).json({message : "Deck | name given not valid"});
    }

    const deck = deckBody.data.deck;
    const userid = res.locals.userid; // Should come from middleware

    // Check number of decks user have
    const [numDecks] = await db.all("select count(*) from user_deck where userid = ?", [userid]);
    if (numDecks["count(*)"] >= ALLOWED_NUM_DECKS){
        return res.status(400).json({message : "You have too much deck, can't add new one"})
    }

    // Check replicates in deck | Can't think of a way using zod
    const uniqueCards = new Set(deck);
    if (uniqueCards.size * MAX_DUPLICATE < DECK_SIZE){
        return res.status(400).json({message : `Your deck has replicates greater than ${MAX_DUPLICATE}`})
    }


    // Add deck
    const insertStatement = await db.prepare("insert into user_deck(deckid, userid, deckname, deck) values (?,?,?,?)");
    await insertStatement.bind([uuidv4(), userid, deckBody.data.deckName, deck]);

    try {
        await insertStatement.run();
        res.json({ message: "Deck Added" });
    }catch (e){
        res.status(500).json({ error: "Server ERROR" });
    }
})

// This make it hard to test, but is fine for UI | I will send the deck id with.
router.put("/deck/:deckid", async (req: DeckPutRequestBody, res: any) =>{
    const deckBody = DeckSchema.safeParse(req.body);
    if (!deckBody.success){ // Should be handled better in UI
        return res.status(400).json({message : "Deck | name given not valid"});
    }

    const deck = deckBody.data.deck;
    const userid = res.locals.userid; // Should come from middleware
    const deckid = req.params.deckid

    // Check replicates in deck | Can't think of a way using zod
    const uniqueCards = new Set(deck);
    if (uniqueCards.size * MAX_DUPLICATE < DECK_SIZE){
        return res.status(400).json({message : `Your deck has replicates greater than ${MAX_DUPLICATE}`})
    }

    // Update deck
    const updateStatement = await db.prepare("update user_deck set deckname = ?, deck = ? where deckid = ? and userid = ?");
    await updateStatement.bind([deckBody.data.deckName, deck, deckid, userid]);

    try {
        await updateStatement.run();
        res.json({ message: "Deck Updated" });
    }catch (e){
        res.status(500).json({ error: "Server ERROR" });
    }
})

// Get all decks for user
router.get("/deck", async (req: any, res:any) =>{
    try{
        const decks = await db.all("select * from user_deck where userid = ?",[res.locals.userid]);
        // Processing from "1,2,3,4" => "[1,2,3,4]"
        for(let i = 0; i < decks.length; i++){
            decks[i]["deck"] = decks[i]["deck"].split(",")
        }

        return res.json({decks: decks});
    } catch (e){
        return res.status(500).json({error : "Server query error"});
    }
})

// Get deck for user by id
router.get("/deck/:deckid", async (req: any, res:any) =>{
    try{
        const decks = await db.get("select * from user_decks where userid=? and deckid = ?",[res.locals.userid, req.params.deckid]);
        if (decks === undefined){
            return res.status(403).json({error : "Deck not found"});
        }
        return res.json({decks: [decks]});
    } catch (e){
        return res.status(500).json({error : "Server query error"});
    }
})


router.delete("/deck/:deckid", async (req: any, res:any) =>{
    const deleteStatement = await db.prepare("delete from user_deck where deckid=? and userid=?");
    await deleteStatement.bind([req.params.deckid, res.locals.userid]);
    try{
        deleteStatement.run();
        return res.json({message : "deck deleted"})
    }catch(e){
        return res.status(500).json({ error: "Server query error" });
    }
    
})

export const deckManager = router;