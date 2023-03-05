<<<<<<< HEAD
<<<<<<< HEAD
import Navbar from '../Components/Navbar';
=======
import React, { useEffect, useState, useRef } from "react";
=======
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, Ref } from "react";
>>>>>>> 6377619... adding UI for deckbuild-TEMP
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
// import StarBorderIcon from '@mui/icons-material/StarBorder';
import axios from 'axios';

import { ALL_CARDS } from '../utils/cards';

interface CardPollRef {
    putCardBack : (cardId : string) => void
}

interface CardPollProps {
    pickfn : (cardid:string)=>void
}

const numType = 2; // Number of each type of card allowed

// https://stackoverflow.com/questions/37949981/call-child-method-from-parent
const CardPoll = forwardRef((props : CardPollProps, ref : Ref<CardPollRef>)=>{
    const ROW_HEIGHT = 164;
    const CARDS_PER_ROW = 10;
    const NUM_CARDS : number = Object.keys(ALL_CARDS).length;
    const TOTAL_HEIGHT = ROW_HEIGHT * Math.ceil(NUM_CARDS / CARDS_PER_ROW);
    const TOTAL_WIDTH = Math.ceil(ROW_HEIGHT * CARDS_PER_ROW / 2);

    // https://stackoverflow.com/questions/36467369/looping-through-an-object-and-changing-all-values
    const [cards, setCards] = useState<{[id: string] : number}>(
        Object.keys(ALL_CARDS).reduce((prv, key) => ({...prv , [key] : numType}), {})
    );

    function takeCard(cardId : string):boolean{
        const idCardCount = cards[cardId]
        if (idCardCount > 0){
            const copyCards = {...cards}
            copyCards[cardId] = idCardCount - 1
            setCards(copyCards);
            return true
        }
        
        console.log("You can't add anymore");
        return false;
    }

    useImperativeHandle(ref, ()=>({
        putCardBack(cardId : string):void{
            const copyCards = {...cards};
            copyCards[cardId]++
            setCards(copyCards);
        }
    }))


    return (
        // Width = Height / 2
        <ImageList sx={{ width: TOTAL_WIDTH, height: TOTAL_HEIGHT,}} cols={CARDS_PER_ROW} rowHeight={ROW_HEIGHT}>
            {
                Object.entries(ALL_CARDS).map(([id, img])=>{
                    const stillAva = (cards[id]) === 0;
                    return <ImageListItem key={id}>
                        <img
                            src={img}
                            alt={id}
                            loading="lazy"
                            style={{filter : `grayscale(${stillAva ? 100 : 0}%)`}}
                            onClick={()=>{takeCard(id) && props.pickfn(id) } }
                        />
                    </ImageListItem>
                })
            }
        </ImageList>
    );
})


interface UserDeckRef {
    addCard : (cardId : string) => void
}

interface UserDeckProp{
    deck : string[],
    deckid : string,
    dropfn : (cardid: string)=>void
}

const UserDeck = forwardRef((props : UserDeckProp, ref : Ref<UserDeckRef>)=>{
    // Init
    const deckC : {[id: string] : number} = {};
    for(const i of props.deck){
        deckC[i] ? deckC[i]++ : deckC[i] = 1
    }

    const deckId = props.deckid;
    const [deckCounter, setDeckCounter] = useState<{[id: string] : number}>(deckC);



    function removeCard(cardId : string):boolean{
        const copyCards = {...deckCounter}
        copyCards[cardId]--;
        if (copyCards[cardId] === 0){
            delete copyCards[cardId]
        }
        setDeckCounter(copyCards)
        return true
    }


    useImperativeHandle(ref, ()=>({
        addCard(cardId : string):void{
            const copyCards = {...deckCounter}
            copyCards[cardId] ? copyCards[cardId]++ : copyCards[cardId] = 1;
            setDeckCounter(copyCards)
        }
    }))

    return (
        <ImageList sx={{ width: 100}} cols={1} rowHeight={25}>
            {   
                Object.entries(deckCounter).map(([cardid, count])=>{
                    return <ImageListItem key={cardid+count}>
                        <div style={{ position: 'relative' }}>
                            <img
                                src={ALL_CARDS[cardid]}
                                alt={cardid}
                                loading="lazy"
                                onClick={()=>{console.log("giao"); removeCard(cardid) && props.dropfn(cardid)} }
                            />
                            {/* The label with number of card */}
                            <div style={{ color:"white", position: 'absolute', top: '3px', right: '20px', padding: '5px' }}>
                                {count}
                            </div>
                        </div>
                    </ImageListItem>
                })
            }
        </ImageList>
    )
})


<<<<<<< HEAD
    useEffect(()=>{
        // const 
    })
}
>>>>>>> ceb483a... basic frontend for deck building-not done
=======
>>>>>>> 6377619... adding UI for deckbuild-TEMP

export default function Deck() {
    // Assume user have login cookie
    const cardPollRef = useRef<CardPollRef>(null);
    const userDeckRef = useRef<UserDeckRef>(null);
    // const [picked, setPicked] =  useState<{[deckId:string] : number[]}>({});

    useEffect(()=>{
        const upload = async()=>{
            try{
                
            }catch(e : any){
                console.log(e)
            }
        }

    }, [])


    return (
<<<<<<< HEAD
<<<<<<< HEAD
        <div>
            <Navbar/>
            <p>DECK</p>
        </div>
=======
        <div> DECK
            <CardPoll/>
         </div>
>>>>>>> ceb483a... basic frontend for deck building-not done
=======
        // <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        // Currently testing | my screen is too small
        <div>
            <div style={{ marginRight: '100px' }}>
                <CardPoll 
                    ref={cardPollRef}
                    pickfn = {(cardid : string) => {userDeckRef.current?.addCard(cardid)}}
                /> 
            </div>

            <div>
                <UserDeck 
                    ref={userDeckRef} 
                    deck={["1", "2", "3", "4","5","6","7","8"]} 
                    deckid="123123" 
                    dropfn={(cardid : string)=>{ cardPollRef.current?.putCardBack(cardid) }} 
                />
            </div>
        </div>
>>>>>>> 6377619... adding UI for deckbuild-TEMP
    )
}