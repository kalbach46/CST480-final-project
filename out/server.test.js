import axios from "axios";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as url from "url";
let port = 3000;
let host = "localhost";
let protocol = "http";
let api = "api";
let accountManager = "accountManager";
let deckManager = "deckManager";
let authUrl = `${protocol}://${host}:${port}/${api}/${accountManager}`;
let deckUrl = `${protocol}://${host}:${port}/${api}/${deckManager}`;
let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbfile = `${__dirname}database.db`;
let db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");
await db.get("PRAGMA journal_mode=WAL");
const USERNAME = 'kalbach46';
const PASSWORD = 'password';
// clear database before all tests
beforeEach(async () => {
    await db.run("DELETE FROM user_deck");
    await db.run("DELETE FROM user_stat");
    await db.run("DELETE FROM users");
});
//clear database after each run
afterAll(async () => {
    await db.run("DELETE FROM user_deck");
    await db.run("DELETE FROM user_stat");
    await db.run("DELETE FROM users");
});
//CREATE USER TESTS
describe("Create User Tests", () => {
    test("create user happy path", async () => {
        let username = USERNAME;
        let password = PASSWORD;
        let result = await axios.post(`${authUrl}/register`, {
            username: username,
            password: password
        });
        expect(result.data).toEqual("user created successfully");
    });
    test("create two users happy path", async () => {
        let username = USERNAME;
        let username2 = "username2";
        let password = PASSWORD;
        await axios.post(`${authUrl}/register`, {
            username: username,
            password: password
        });
        let result = await axios.post(`${authUrl}/register`, {
            username: username2,
            password: password
        });
        expect(result.data).toEqual("user created successfully");
    });
    test("create user username in use", async () => {
        let username = USERNAME;
        let password = PASSWORD;
        await axios.post(`${authUrl}/register`, {
            username: username,
            password: password
        });
        try {
            await axios.post(`${authUrl}/register`, {
                username: username,
                password: password
            });
            fail('this call should return a 400');
        }
        catch (error) {
            let errorObj = error;
            if (errorObj.response === undefined) {
                throw errorObj;
            }
            let { response } = errorObj;
            expect(response.status).toEqual(400);
            expect(response.data).toEqual({ error: "username is already in use" });
        }
    });
});
//LOGIN TESTS
describe("Login tests", () => {
    test("login happy path", async () => {
        await initializeUser();
        let username = USERNAME;
        let password = PASSWORD;
        let result = await axios.put(`${authUrl}/login`, {
            username: username,
            password: password
        });
        expect(result.data.token != null).toBeTruthy();
    });
    test("login username doesn't exist", async () => {
        await initializeUser();
        let username = "badusername";
        let password = PASSWORD;
        try {
            await axios.put(`${authUrl}/login`, {
                username: username,
                password: password
            });
            fail('this call should return a 400');
        }
        catch (error) {
            let errorObj = error;
            if (errorObj.response === undefined) {
                throw errorObj;
            }
            let { response } = errorObj;
            expect(response.status).toEqual(400);
            expect(response.data).toEqual({ error: "no user exists with that username" });
        }
    });
    test("login invalid password", async () => {
        await initializeUser();
        let username = USERNAME;
        let password = "badpassword";
        try {
            await axios.put(`${authUrl}/login`, {
                username: username,
                password: password
            });
            fail('this call should return a 400');
        }
        catch (error) {
            let errorObj = error;
            if (errorObj.response === undefined) {
                throw errorObj;
            }
            let { response } = errorObj;
            expect(response.status).toEqual(400);
            expect(response.data).toEqual({ error: "password is incorrect" });
        }
    });
});
const DECK_NAME = "DeckName";
const DECK = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
// Deck handling test
describe("Deck tests", () => {
    const deckReq = async () => {
        await axios.post(`${deckUrl}/deck`, {
            deckName: DECK_NAME,
            deck: DECK,
        });
    };
    const getFirstDeckId = async () => {
        let result = await axios.get(`${deckUrl}/deck`);
        return result.data.decks[0].deckid;
    };
    test("not logged in actions", async () => {
        const failGet = async () => {
            return await axios.get(`${deckUrl}/deck`);
        };
        const failPost = async () => {
            return await axios.post(`${deckUrl}/deck`);
        };
        const failPut = async () => {
            return await axios.put(`${deckUrl}/deck/123`);
        };
        const failDelete = async () => {
            return await axios.delete(`${deckUrl}/deck/123`);
        };
        for (const i of [failGet, failPost, failPut, failDelete]) {
            const result = await i();
            expect(result.data).toEqual("invalid token");
        }
    });
    test("build deck happy path", async () => {
        await initializeUser();
        await loginUser();
        let result = await axios.post(`${deckUrl}/deck`, {
            deckName: DECK_NAME,
            deck: DECK
        });
        expect(result.data).toEqual({ message: "Deck Added" });
    });
    test("build deck bad path", async () => {
        await initializeUser();
        await loginUser();
        const noDeck = async () => {
            await axios.post(`${deckUrl}/deck`, {
                deckName: DECK_NAME,
                deck: [],
            });
        };
        const noName = async () => {
            await axios.post(`${deckUrl}/deck`, {
                deckName: "",
                deck: DECK,
            });
        };
        const deckTooLarge = async () => {
            await axios.post(`${deckUrl}/deck`, {
                deckName: DECK_NAME,
                deck: ['1', '1', '1', '2', '4', '5', '6', '7', '8', '9'],
            });
        };
        expect(await failRequest(noDeck, 400, { message: "Deck | name given not valid" })).toEqual(true);
        expect(await failRequest(noName, 400, { message: "Deck | name given not valid" })).toEqual(true);
        expect(await failRequest(deckTooLarge, 400, { message: "Your deck has replicates greater than 2" })).toEqual(true);
    });
    test("have too much deck and still build", async () => {
        await initializeUser();
        await loginUser();
        for (let i = 0; i < 5; i++) {
            await deckReq();
        }
        expect(await failRequest(deckReq, 400, { message: "You have too much deck, can't add new one" })).toEqual(true);
    });
    test("get all deck", async () => {
        await initializeUser();
        await loginUser();
        await deckReq();
        let result = await axios.get(`${deckUrl}/deck`);
        expect(result.data.decks).toBeTruthy();
    });
    test("get single deck", async () => {
        await initializeUser();
        await loginUser();
        await deckReq();
        const did = await getFirstDeckId();
        let result = await axios.get(`${deckUrl}/deck/${did}`);
        expect(result.data.decks).toBeTruthy();
    });
    test("update deck happy", async () => {
        await initializeUser();
        await loginUser();
        await deckReq();
        const did = await getFirstDeckId();
        let result = await axios.put(`${deckUrl}/deck/${did}`, {
            deckName: "NEW_DECK",
            deck: DECK
        });
        expect(result.data).toEqual({ message: "Deck Updated" });
    });
    test("update deck invalid", async () => {
        await initializeUser();
        await loginUser();
        await deckReq();
        const did = await getFirstDeckId();
        const badPut = async () => {
            await axios.put(`${deckUrl}/deck/${did}`, {
                deckName: "NEW_DECK",
                deck: []
            });
        };
        expect(await failRequest(badPut, 400, { message: "Deck | name given not valid" })).toEqual(true);
    });
    test("delete deck happy", async () => {
        await initializeUser();
        await loginUser();
        await deckReq();
        const did = await getFirstDeckId();
        const result = await axios.delete(`${deckUrl}/deck/${did}`);
        expect(result.data).toEqual({ message: "deck deleted" });
    });
});
//GET USER TESTS
// describe("Get user tests", () => {
//     test("get user happy path", async () => {
//         await initializeUser();
//         let username : string = USERNAME;
//         let password : string = PASSWORD;
//         let loginResult = await axios.put(`${authUrl}/login`, {
//             username:username,
//             password:password
//         });
//         let token = loginResult.data.token;
//         let result = await axios.get(`${authUrl}/user`, {
//             headers:{
//                 Cookie: `token=${token}`
//             }
//         });
//         expect(result.data.username).toEqual("kalbach46");
//     });
//     test("get user no user logged in", async () => {
//         await initializeUser();
//         let username : string = USERNAME;
//         let password : string = PASSWORD;
//         try{
//             let loginResult = await axios.put(`${authUrl}/login`, {
//                 username:username,
//                 password:password
//             });
//             let token = loginResult.data.token;
//             let result = await axios.get(`${authUrl}/user`, {
//                 headers:{
//                     Cookie: `token=${token}`
//                 }
//             });
//             fail('this call should return a 400');
//         } catch (error) {
//             let errorObj = error as AxiosError;
//             if (errorObj.response === undefined) {
//                 throw errorObj;
//             }
//             let { response } = errorObj;
//             expect(response.status).toEqual(400);
//             expect(response.data).toEqual({error: "no user exists with that username"});
//         }
//     });
//     // test("get user username doesn't exist", async () => {
//     // })
// })
//-----------------HELPERS-----------------------
async function initializeUser() {
    let username = USERNAME;
    let password = PASSWORD;
    let result = await axios.post(`${authUrl}/register`, {
        username: username,
        password: password
    });
}
async function loginUser() {
    const username = USERNAME;
    const password = PASSWORD;
    const result = await axios.put(`${authUrl}/login`, {
        username: username,
        password: password
    });
    axios.defaults.headers.common['Cookie'] = `token=${result.data.token}`;
    axios.defaults.withCredentials = true;
}
async function failRequest(axiosFn, status, res) {
    try {
        await axiosFn();
        return false;
    }
    catch (error) {
        let errorObj = error;
        if (errorObj.response === undefined) {
            throw errorObj;
        }
        let { response } = errorObj;
        expect(response.status).toEqual(status);
        expect(response.data).toEqual(res);
        return true;
    }
}
