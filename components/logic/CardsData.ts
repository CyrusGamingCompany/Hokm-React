import { CardModel, Suit } from "../dataModels/CardModel";

// export const getHakemIcon=()=>{
//   return require('../../assets/images/hakem.png');
// }
const getCardImage = (card:CardModel |string|null)=>{
  let value: string;
  if(card===null || card === undefined) return null;
  if(typeof card ==='string') value = card;
  else value = card.toString();
  switch (value) {
    case 'Clubs_2':

      return require('../../assets/images/VintagePlayingCards/Clubs_2.png');
    case 'Clubs_3':
      return require('../../assets/images/VintagePlayingCards/Clubs_3.png');
    case 'Clubs_4':
      return require('../../assets/images/VintagePlayingCards/Clubs_4.png');
    case 'Clubs_5':
      return require('../../assets/images/VintagePlayingCards/Clubs_5.png');
    case 'Clubs_6':
      return require('../../assets/images/VintagePlayingCards/Clubs_6.png');
    case 'Clubs_7':
      return require('../../assets/images/VintagePlayingCards/Clubs_7.png');
    case 'Clubs_8':
      return require('../../assets/images/VintagePlayingCards/Clubs_8.png');
    case 'Clubs_9':
      return require('../../assets/images/VintagePlayingCards/Clubs_9.png');
    case 'Clubs_10':
      return require('../../assets/images/VintagePlayingCards/Clubs_10.png');
    case 'Clubs_J':
      return require('../../assets/images/VintagePlayingCards/Clubs_J.png');
    case 'Clubs_Q':
      return require('../../assets/images/VintagePlayingCards/Clubs_Q.png');
    case 'Clubs_K':
      return require('../../assets/images/VintagePlayingCards/Clubs_K.png');
    case 'Clubs_A':
      return require('../../assets/images/VintagePlayingCards/Clubs_A.png');
    case 'Diamonds_2':
      return require('../../assets/images/VintagePlayingCards/Diamonds_2.png');
    case 'Diamonds_3':
      return require('../../assets/images/VintagePlayingCards/Diamonds_3.png');
    case 'Diamonds_4':
      return require('../../assets/images/VintagePlayingCards/Diamonds_4.png');
    case 'Diamonds_5':
      return require('../../assets/images/VintagePlayingCards/Diamonds_5.png');
    case 'Diamonds_6':
      return require('../../assets/images/VintagePlayingCards/Diamonds_6.png');
    case 'Diamonds_7':
      return require('../../assets/images/VintagePlayingCards/Diamonds_7.png');
    case 'Diamonds_8':
      return require('../../assets/images/VintagePlayingCards/Diamonds_8.png');
    case 'Diamonds_9':
      return require('../../assets/images/VintagePlayingCards/Diamonds_9.png');
    case 'Diamonds_10':
      return require('../../assets/images/VintagePlayingCards/Diamonds_10.png');
    case 'Diamonds_J':
      return require('../../assets/images/VintagePlayingCards/Diamonds_J.png');
    case 'Diamonds_Q':
      return require('../../assets/images/VintagePlayingCards/Diamonds_Q.png');
    case 'Diamonds_K':
      return require('../../assets/images/VintagePlayingCards/Diamonds_K.png');
    case 'Diamonds_A':
      return require('../../assets/images/VintagePlayingCards/Diamonds_A.png');
    case 'Hearts_2':
      return require('../../assets/images/VintagePlayingCards/Hearts_2.png');
    case 'Hearts_3':
      return require('../../assets/images/VintagePlayingCards/Hearts_3.png');
    case 'Hearts_4':
      return require('../../assets/images/VintagePlayingCards/Hearts_4.png');
    case 'Hearts_5':
      return require('../../assets/images/VintagePlayingCards/Hearts_5.png');
    case 'Hearts_6':
      return require('../../assets/images/VintagePlayingCards/Hearts_6.png');
    case 'Hearts_7':
      return require('../../assets/images/VintagePlayingCards/Hearts_7.png');
    case 'Hearts_8':
      return require('../../assets/images/VintagePlayingCards/Hearts_8.png');
    case 'Hearts_9':
      return require('../../assets/images/VintagePlayingCards/Hearts_9.png');
    case 'Hearts_10':
      return require('../../assets/images/VintagePlayingCards/Hearts_10.png');
    case 'Hearts_J':
      return require('../../assets/images/VintagePlayingCards/Hearts_J.png');
    case 'Hearts_Q':
      return require('../../assets/images/VintagePlayingCards/Hearts_Q.png');
    case 'Hearts_K':
      return require('../../assets/images/VintagePlayingCards/Hearts_K.png');
    case 'Hearts_A':
      return require('../../assets/images/VintagePlayingCards/Hearts_A.png');
    case 'Spades_2':
      return require('../../assets/images/VintagePlayingCards/Spades_2.png');
    case 'Spades_3':
      return require('../../assets/images/VintagePlayingCards/Spades_3.png');
    case 'Spades_4':
      return require('../../assets/images/VintagePlayingCards/Spades_4.png');
    case 'Spades_5':
      return require('../../assets/images/VintagePlayingCards/Spades_5.png');
    case 'Spades_6':
      return require('../../assets/images/VintagePlayingCards/Spades_6.png');
    case 'Spades_7':
      return require('../../assets/images/VintagePlayingCards/Spades_7.png');
    case 'Spades_8':
      return require('../../assets/images/VintagePlayingCards/Spades_8.png');
    case 'Spades_9':
      return require('../../assets/images/VintagePlayingCards/Spades_9.png');
    case 'Spades_10':
      return require('../../assets/images/VintagePlayingCards/Spades_10.png');
    case 'Spades_J':
      return require('../../assets/images/VintagePlayingCards/Spades_J.png');
    case 'Spades_Q':
      return require('../../assets/images/VintagePlayingCards/Spades_Q.png');
    case 'Spades_K':
      return require('../../assets/images/VintagePlayingCards/Spades_K.png');
    case 'Spades_A':
      return require('../../assets/images/VintagePlayingCards/Spades_A.png');
    case 'Back':
      return require('../../assets/images/VintagePlayingCards/Back.png');
  }
};

// const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
const suits = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];
const values = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];

export const getCardId = (suit:string, value:string) => `${suit}_${value}`;

export const allCards = ():CardModel[] => {
  const cards : CardModel[]=[];
  suits.forEach(suit => {
    values.forEach(value => {
      cards.push(new CardModel(suit, value));
    });
  });
  return cards;
};

export const shuffleDeck = () => {
  const deck = [...allCards()];
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};



export default getCardImage;
