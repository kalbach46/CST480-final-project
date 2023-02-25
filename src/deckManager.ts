import { DeckSchema, DeckRequestBody, DECK_SIZE } from './deckManager.type.js'
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { v4 as uuidv4 } from 'uuid';


let router = express.Router();
router.use(express.json());
// Add cred middleware here -> Waitig now
// router.use(credientialMiddleware);

export let db = await open({filename: "../database.db",driver: sqlite3.Database,});
await db.get("PRAGMA foreign_keys = ON");

const ALLOWED_NUM_DECKS = 5;
const MAX_DUPLICATE = 2;

router.post("/deck", async (req: DeckRequestBody, res: any) =>{
    const deckBody = DeckSchema.safeParse(req.body);
    if (!deckBody.success){ // Should be handled better in UI
        return res.status(400).json({message : "Deck given not valid"});
    }

    const deck = deckBody.data.deck;
    const userid = res.locals.userid; // Should come from middleware

    // Check number of decks user have
    const numDecks = await db.get("select count(*) from user_deck where id = ?", [userid]);
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
    insertStatement.bind([uuidv4(), userid, deckBody.deckName, deck]);

    try {
        await insertStatement.run();
        res.json({ message: "Deck Added" });
    }catch (e){
        res.status(500).json({ error: "DB ERROR" });
    }

    
})