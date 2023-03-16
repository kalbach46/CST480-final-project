import Navbar from '../Components/Navbar';
import { Typography } from '@mui/material';

export default function Home() {
    return (
        <div>
            <Navbar/>
            <Typography variant="h3"> Welcome to "Deck-Building" game </Typography>

            <Typography variant="h4"> Deck Building </Typography>
            <Typography> 1. Each user is allowed up to 5 Decks </Typography>
            <Typography> 2. Each deck allow 10 cards | but you can't have more than 2 replica </Typography>
            <Typography> - 1. Start by clicking on the Deck tab on this page  </Typography>
            <Typography> - 2. First click on "New Deck" on the bottom left of the page </Typography>
            <Typography> - 3. Click on the card pool on the top left  </Typography>
            <Typography> - 4. Once you are done, give your deck a name on the top right and hit "Save Deck" </Typography>

            <Typography variant="h4"> Game </Typography>
            <Typography> 1. Start by clicking on the "Play" tab on this page  </Typography>
            <Typography> 2. You will be directed into a Unity interface that   </Typography>
            <Typography> 3. You can pick a deck that you want to use and start a 1v1 match  </Typography>
            <Typography> - 1. Each turn you will put a card down to the 3x3 board </Typography>
            <Typography> - 2. All your cards will start attacking ALL enemy cards that is 1 Manhattan Distance away </Typography>
            <Typography> - 3. When you card has 0 hp, it will be wiped out </Typography>
            
            <Typography variant="h4"> Game Termination </Typography>
            <Typography> 1. if Player A has more than 4 cards on the board, then A wins </Typography>
            <Typography> 2.a if both player has NO cards in hand, the player with more cards on board wins </Typography>
            <Typography> 2.b if they have the same number of cards then It's a tie </Typography>

            
            
        </div>
    )
}