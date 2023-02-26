import axios, { AxiosError } from "axios";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import * as url from "url";

let port = 3000;
let host = "localhost";
let protocol = "http";
let accountManager = "accountManager";
let authUrl = `${protocol}://${host}:${port}/${accountManager}`;


let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbfile = `${__dirname}database.db`;
let db = await open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");
await db.get("PRAGMA journal_mode=WAL");

const USERNAME : string = 'kalbach46';
const PASSWORD : string = 'password';

// clear database before all tests
beforeEach(async () => {
    await db.run(
        "DELETE FROM user_deck"
    );
    await db.run(
        "DELETE FROM user_stat"
    );
    await db.run(
        "DELETE FROM users"
    );
})

//clear database after each run
afterAll(async () => {
    await db.run(
        "DELETE FROM user_deck"
    );
    await db.run(
        "DELETE FROM user_stat"
    );
    await db.run(
        "DELETE FROM users"
    );
})

//CREATE USER TESTS
// describe("Create User Tests", () => {
//     test("create user happy path", async () => {
//         let username : string = USERNAME;
//         let password : string = PASSWORD;
//         let result = await axios.post(`${authUrl}/register`, {
//             username:username,
//             password:password
//         });
//         expect(result.data).toEqual("user created successfully");
//     });
//     test("create two users happy path", async () => {
//         let username : string = USERNAME;
//         let username2 : string = "username2";
//         let password : string = PASSWORD;
//         await axios.post(`${authUrl}/register`, {
//             username:username,
//             password:password
//         });
//         let result = await axios.post(`${authUrl}/register`, {
//             username:username2,
//             password:password
//         });
//         expect(result.data).toEqual("user created successfully");
//     })
//     test("create user username in use", async () => {
//         let username : string = USERNAME;
//         let password : string = PASSWORD;
//         await axios.post(`${authUrl}/register`, {
//             username:username,
//             password:password
//         });

//         try{
//             await axios.post(`${authUrl}/register`, {
//                 username:username,
//                 password:password
//             });
//             fail('this call should return a 400');
//         } catch (error) {
//             let errorObj = error as AxiosError;
    
//             if (errorObj.response === undefined) {
//                 throw errorObj;
//             }
    
//             let { response } = errorObj; 
//             expect(response.status).toEqual(400);
//             expect(response.data).toEqual({error: "username is already in use"});
//         }
//     })
// })

//LOGIN TESTS
describe("Login tests", () => {
    test("login happy path", async () => {
        await initializeUser();
        let username : string = USERNAME;
        let password : string = PASSWORD;
        let result = await axios.put(`${authUrl}/login`, {
            username:username,
            password:password
        });
        expect(result.data.token != null).toBeTruthy();
    });
    test("login username doesn't exist", async () => {
        await initializeUser();
        let username : string = "badusername";
        let password : string = PASSWORD;
        try{
            await axios.put(`${authUrl}/login`, {
                username:username,
                password:password
            });
            fail('this call should return a 400');
        } catch (error) {
            let errorObj = error as AxiosError;
    
            if (errorObj.response === undefined) {
                throw errorObj;
            }
    
            let { response } = errorObj;
    
            expect(response.status).toEqual(400);
            expect(response.data).toEqual({error: "no user exists with that username"});
        }
    });
    test("login invalid password", async () => {
        await initializeUser();
        let username : string = USERNAME;
        let password : string = "badpassword";
        try{
            await axios.put(`${authUrl}/login`, {
                username:username,
                password:password
            });
            fail('this call should return a 400');
        } catch (error) {
            let errorObj = error as AxiosError;
    
            if (errorObj.response === undefined) {
                throw errorObj;
            }
    
            let { response } = errorObj;
    
            expect(response.status).toEqual(400);
            expect(response.data).toEqual({error: "password is incorrect"});
        }
    });
})

//-----------------HELPERS-----------------------
async function initializeUser() {
    let username:string = USERNAME;
    let password:string = PASSWORD;
    let result = await axios.post(`${authUrl}/register`, {
        username:username,
        password:password
    });
}