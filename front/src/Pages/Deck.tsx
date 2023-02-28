import React, { useEffect, useState, useRef } from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import axios from 'axios';

import { ALL_CARDS } from '../utils/cards';



function Card(props : any){
    // This will be mainly image, but will share a counter to make it dark and unclickable

}


function CardPoll(props : any){
    const ROW_HEIGHT = 164;
    const CARDS_PER_ROW = 10;
    const NUM_CARDS : number = Object.keys(ALL_CARDS).length;
    const TOTAL_HEIGHT = ROW_HEIGHT * Math.ceil(NUM_CARDS / CARDS_PER_ROW);
    const TOTAL_WIDTH = Math.ceil(ROW_HEIGHT * CARDS_PER_ROW / 2);

    const numType = 2; // Number of each type of card allowed


    // https://stackoverflow.com/questions/36467369/looping-through-an-object-and-changing-all-values
    const [cards, setCards] = useState<{[id: string] : number}>(
        Object.keys(ALL_CARDS).reduce((prv, key) => ({...prv , [key] : numType}), {})
    );

    function takeCard(cardId : string):void{
        const idCardCount = cards[cardId]
        if (idCardCount > 0){
            const copyCards = {...cards}
            copyCards[cardId] = idCardCount - 1
            setCards(copyCards);
        }else{
            console.log("You can't add anymore");
        }
    }

    return (
        // Width = Height / 2
        <ImageList sx={{ width: TOTAL_WIDTH, height: TOTAL_HEIGHT,}} cols={CARDS_PER_ROW} rowHeight={ROW_HEIGHT}>
            {
                Object.entries(ALL_CARDS).map(([id, img])=>{
                    const stillAva = (cards[id]) === 0;
                    return <ImageListItem key={id}>
                        <img
                            src={img}
                            loading="lazy"
                            style={{filter : `grayscale(${stillAva ? 100 : 0}%)`}}
                            onClick={()=>takeCard(id)}
                        />
                    </ImageListItem>
                })
            }
        </ImageList>
    );

}


function PickCardBoard(){
    const [cards, setCards] = useState<number[]>([]);

    useEffect(()=>{
        // const 
    })
}

export default function Deck() {
    // Assume user have login cookie
    const [picked, setPicked] =  useState<{[deckId:string] : number[]}>({});

    useEffect(()=>{
        const upload = async()=>{
            try{
                
            }catch(e : any){
                console.log(e)
            }
        }

    }, [])


    return (
        <div> DECK
            <CardPoll/>
         </div>
    )
    
}