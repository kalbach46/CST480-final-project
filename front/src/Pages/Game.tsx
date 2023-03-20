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
        sendMessage("Manager", "GetDecks", userDecks);
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
            <button onClick={unityMessage}>Talk to Unity</button>
            <div>
            <Unity unityProvider={unityProvider} />
            </div>
        </div>
    )
}