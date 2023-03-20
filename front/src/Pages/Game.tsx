import Navbar from '../Components/Navbar';
import React, { FC, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { application, response } from 'express';
import restProvider from 'ra-data-simple-rest';
import { Unity, useUnityContext } from "react-unity-webgl";

export default function Game() {

    const { unityProvider, sendMessage, addEventListener, removeEventListener, isLoaded } = useUnityContext({
        loaderUrl: "Build/Build.loader.js",
        dataUrl: "Build/Build.data.unityweb",
        frameworkUrl: "Build/Build.framework.js.unityweb",
        codeUrl: "Build/Build.wasm.unityweb",
    });

    let unityMessage = () => {
        console.log("Pressed unity message button");
        sendMessage("Manager", "Message", 100);
    }


    let sendUnityDecks = async () => {
        const allDecks = await axios.get("/api/deckManager/deck");
        const userDecks : deckData[] = allDecks.data.decks;
        const to3List = userDecks.reduce((prev : any[][], cur) => {
            const copy = [...prev]
            copy[0].push(cur.deckid);
            copy[1].push(cur.deckname);
            copy[2].push(cur.deck);
            return copy
        } , [[],[],[]])

        const deckNames = to3List[1];
        const decks = to3List[2];

        unityMessage();

        userDecks.forEach((deck: deckData) => {
            console.log(deck);
            console.log(deck.deck)
            sendMessage("Manager", "GetDeckNames", deck.deckname);
            deck.deck.forEach((card: string) => {
                console.log(card);
                sendMessage("Manager", "GetDecks", card)
            })
            //sendMessage("Manager", "GetCards", deck.deck);
        })


        /*deckNames.forEach(name => {
            console.log("The name from front end ", name);
            sendMessage("Manager", "GetDeckNames", String(name));
        });

        decks.forEach(deck => {
            deck.foreach((card: string) => {
                sendMessage("Manager", "GetDecks", card)
                console.log("The card sent fron front end ", card)
            })
            //console.log(deck);
            //sendMessage("Manager", "GetDecks", deck);
        })*/

        sendMessage("Manager", "Done");

        //sendMessage("Manager", "GetDecks", to3List[0], to3List[1], to3List[2]);
        //sendMessage("Manager", "GetDeckNames", deckNames[0]);
        //sendMessage("Manager", "GetDecks", decks);
    };
    

    // Should look like 
    interface deckData{
        deckid : string,
        deckname: string,
        deck : string[],
    }


    return (
        <div>
            <Navbar/>
            <p>GAME</p>
            <button onClick={sendUnityDecks}>Talk to Unity</button>
            <div>
            <Unity unityProvider={unityProvider} style= {{ width: 1000, height: 600 }} />
            </div>
        </div>
    )
}