import express, {Response, Express} from "express";
const router = express.Router()

router.get('/', (req, res) => {
    res.send("accountManager");
});

router.get('/test', (req, res) => {
    res.send("test");
})

export const accountManager = router;