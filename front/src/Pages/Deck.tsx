import { useEffect, useState, useRef, useImperativeHandle, forwardRef, Ref } from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import axios from 'axios';

import { ALL_CARDS } from '../utils/cards';
import { ALL_BACKGROUNDS } from "../utils/cardbackground";
import { Button , Input} from "@mui/material";


interface CardPollRef {
    putCardBack : (cardId : string) => void
}

interface CardPollProps {
    deck : string[],
    pickfn : (cardid:string)=>void,
    requiredCards : number,
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
    

    useEffect(()=>{
        //  Init 
        const copyCards = {...cards}
        for (const cardid of props.deck){
            copyCards[cardid] --;
        }
        setCards(copyCards);
    }, [])
    


    function takeCard(cardId : string):boolean{
        const idCardCount = cards[cardId]
        const userHoldings = (Object.values(ALL_CARDS).length * numType) - Object.values(cards).reduce((a,b)=>a+b, 0)
        if (idCardCount > 0 && userHoldings < props.requiredCards){
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
    deckid? : string,
    deckname? : string,
    requiredCards : number,
    dropfn : (cardid: string)=>void,
    notify : ()=>void,
}

const UserDeck = forwardRef((props : UserDeckProp, ref : Ref<UserDeckRef>)=>{
    // Init
    const deckC : {[id: string] : number} = {};
    for(const i of props.deck){
        deckC[i] ? deckC[i]++ : deckC[i] = 1
    }

    const [deckCounter, setDeckCounter] = useState<{[id: string] : number}>(deckC);
    const [deckName, setDeckName] = useState(props.deckname ? props.deckname : "");

    async function deckUpdate(){
        const toListDeck : string[] = Object.entries(deckCounter).flatMap(([cardid,count])=>{
            return Array(count).fill(cardid)
        })
        try{
            if(props.deckid){// Update deck
                await axios.put(`/api/deckManager/deck/${props.deckid}`, {deck : toListDeck, deckName : deckName})
            }else{// Creating New Deck
                await axios.post("/api/deckManager/deck", {deck : toListDeck, deckName : deckName})
            }
            props.notify() // Tells parent a new deck is posted
            console.log("success")
        }catch(e : any){
            console.log("INVALID DECK : ", e.response.data.message)
        }
    }



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
        <>
            <Input
                type="text"
                placeholder="Deck Name"
                required
                onChange={(e) => {
                    setDeckName(e.target.value);
                }}
                defaultValue={deckName}
            />

            <ImageList sx={{ width: 100}} cols={1} rowHeight={25}>
                {   
                    Object.entries(deckCounter).map(([cardid, count])=>{
                        return <ImageListItem key={cardid+count}>
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={ALL_CARDS[cardid]}
                                    alt={cardid}
                                    loading="lazy"
                                    onClick={()=>{removeCard(cardid) && props.dropfn(cardid)} }
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
            <Button 
                onClick={deckUpdate} 
                disabled={ Object.values(deckCounter).reduce((a, b) => a + b, 0) !== props.requiredCards}
            > 
                Save 
            </Button>
        </>
        
    )
})

interface PickingPollProps{
    getSelected : (pickedDeck:string[], pickedDid:string, pickedDname:string)=>void,
    maxDecks : number,
}

function PickingPool(props:PickingPollProps){
    // Allows the user to pick from their existing deck
    interface deckData{
        deckid : string,
        deckname: string,
        deck : string[],
    }

    const deckWidth = 100;
    const deckHeight = 200;
    const [decks, setDecks] = useState<deckData[]>([])

    useEffect(()=>{
        async function updatePool(){
            console.log("Fetching")
            try{
                const allDecks = await axios.get("/api/deckManager/deck");
                const userDecks : deckData[] = allDecks.data.decks;
                setDecks(userDecks);
            }catch(e : any){
                console.log("Deck fetching failed", e.response.data.error)
            }
        }
        updatePool();
    }, [])
    

    return (
        <>
            <ImageList sx={{ width: (Math.max(decks.length+1, props.maxDecks))*(deckWidth+10)}} cols={Math.max(decks.length+1, props.maxDecks)} rowHeight={deckHeight+10}>
                {
                    decks.map((deckData)=>{
                        return <ImageListItem key={deckData.deckid}> 
                            <div style={{ position: 'relative' }}>
                                 <img
                                    src={ALL_BACKGROUNDS["1"]}
                                    alt={"This is suppose to be some description"}
                                    loading="lazy"
                                    width={deckWidth}
                                    height={deckHeight}
                                    onClick={()=>{
                                        props.getSelected(deckData.deck, deckData.deckid,deckData.deckname)
                                    }}
                                />
                                <div style={{ position: 'absolute', top: '3px', right: '20px', padding: '5px' }}>
                                    {deckData.deckname}
                                </div>
                            </div>
                        </ImageListItem>
                    })
                }
                {
                    decks.length >= props.maxDecks ? <></> : <ImageListItem key="new_deck"> 
                    <div style={{ position: 'relative' }}>
                        <img
                            src={ALL_BACKGROUNDS["newDeck"]}
                            alt={"This to start a new deck"}
                            loading="lazy"
                            width={deckWidth}
                            height={deckHeight}
                            onClick={()=>{
                                props.getSelected([], "","")
                            }}
                        />
                        <div style={{ position: 'absolute', top: '3px', right: '20px', padding: '5px' ,color:"white" }}>
                            {"Start New Deck"}
                        </div>
                    </div>
                </ImageListItem>
                }
                
            </ImageList>
        </>
    )
}



export default function Deck() {
    // Assume user have login cookie
    const cardPollRef = useRef<CardPollRef>(null);
    const userDeckRef = useRef<UserDeckRef>(null);
    const [curDeck, setCurDeck] = useState<{deck:string[], deckid:string, deckname:string}>({deck:[],deckid:"",deckname:""});
    const [updating, setUpdating] = useState<number>(0);
    const [reFetcher, setReFetecher] = useState<number>(0);

    const requiredNumCards = 10;
    const allowedDecks = 5;

    useEffect(() => { // Update force re-render
        setUpdating(updating+1)
    }, [curDeck]);


    return (
        <>
            <div key={updating} style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                <div style={{marginLeft:"10px", marginRight: '100px' }}>
                    <CardPoll 
                        deck={curDeck.deck}
                        requiredCards={requiredNumCards}
                        ref={cardPollRef}
                        pickfn = {(cardid : string) => {userDeckRef.current?.addCard(cardid)}}
                    /> 
                </div>

                <div>
                    <UserDeck 
                        ref={userDeckRef} 
                        deck={curDeck.deck} 
                        deckid={curDeck.deckid} 
                        deckname={curDeck.deckname}
                        requiredCards={requiredNumCards}
                        dropfn={(cardid : string)=>{ cardPollRef.current?.putCardBack(cardid)}}
                        notify={()=>{setReFetecher(reFetcher+1)}}
                    />
                </div>
            </div>
            <div>
                <PickingPool
                    key={reFetcher}
                    maxDecks={allowedDecks}
                    getSelected={(pickedDeck,pickedDid,pickedDname)=>{ 
                        setCurDeck({deck:pickedDeck, deckid:pickedDid, deckname:pickedDname})
                    }}
                />
            </div>
        </>
    )
}