// NOTE | this file serves as a way to show cards with respective IDs
// it will export a HUGE dictionary with [id : string] : image -> a imported file from asset.
// The frontend will make it impossible to return 400 from backend -> meaning good UI design
// but no strict checking as always.
import card1 from "../assets/images/cards/image1.png";
import card2 from "../assets/images/cards/image2.png";
import card3 from "../assets/images/cards/image3.png";
import card4 from "../assets/images/cards/image4.png";
import card5 from "../assets/images/cards/image5.png";
import card6 from "../assets/images/cards/image6.png";
import card7 from "../assets/images/cards/image7.png";
import card8 from "../assets/images/cards/image8.png";
import card9 from "../assets/images/cards/image9.png";
import card10 from "../assets/images/cards/image10.png";
import card11 from "../assets/images/cards/image11.png";
import card12 from "../assets/images/cards/image12.png";
import card13 from "../assets/images/cards/image13.png";
import card14 from "../assets/images/cards/image14.png";
import card15 from "../assets/images/cards/image15.png";
import card16 from "../assets/images/cards/image16.png";
import card17 from "../assets/images/cards/image17.png";
import card18 from "../assets/images/cards/image18.png";
import card19 from "../assets/images/cards/image19.png";
import card20 from "../assets/images/cards/image20.png";

export const ALL_CARDS: {[id: string]: string} = {
  "1": card1,
  "2": card2,
  "3": card3,
  "4": card4,
  "5": card5,
  "6": card6,
  "7": card7,
  "8": card8,
  "9": card9,
  "10": card10,
  "11": card11,
  "12": card12,
  "13": card13,
  "14": card14,
  "15": card15,
  "16": card16,
  "17": card17,
  "18": card18,
  "19": card19,
  "20": card20,
};
