import express, {Response, Express} from "express";
const router = express.Router()

router.get('/', (req, res) => {
    res.send("deckManager");
});

router.get('/test', (req, res) => {
    res.send("test");
})

export const deckManager = router;