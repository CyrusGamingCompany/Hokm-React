import {Button, StyleSheet, View, Alert} from 'react-native';
import PitchCardsContainerView from './components/uiComponents/PitchCardsContainerView';
import ScoreBoardView from './components/uiComponents/ScoreBoardView';
import {shuffleDeck} from './components/logic/CardsData';
import HandCardsView from './components/uiComponents/HandCardsView';
import React, {useEffect, useState} from 'react';
import {
  ILogic,
  IAction,
  CardModel,
  Suit,
} from './components/dataModels/CardModel';
// import FA5_Icon from 'react-native-vector-icons/FontAwesome5';

function sleep(durationInSeconds: number) {
  return new Promise(resolve => setTimeout(resolve, durationInSeconds * 1000));
}

export default function App() {
  const [hakem, setHakem] = useState(-1);
  const [player1Cards, setPlayer1Cards] = useState<CardModel[]>([]);
  const [player2Cards, setPlayer2Cards] = useState<CardModel[]>([]);
  const [player3Cards, setPlayer3Cards] = useState<CardModel[]>([]);
  const [player4Cards, setPlayer4Cards] = useState<CardModel[]>([]);
  const [cardDeck, setCardDeck] = useState(shuffleDeck());
  const [pitchCards, setPitchCards] = useState<CardModel[]>([]);

  useEffect(() => {
    const dealCard = async () => {
      if (hakem === -1) {
        console.log(`Hakem is not selected: ${hakem}`);
        await sleep(1);
      } else {
        console.log(`Hakem is selected: ${hakem}`);
        await dealCardsForAllAsync();
        await sleep(1);
      }
    };
    dealCard();
  }, [hakem]);

  const [gameStatistics, setGameStatistics] = useState({
    team1: {name: 'You', score: 0},
    team2: {name: 'Com', score: 0},
  });
  const [isStarted, setIsStarted] = useState(false);

  function batchDealToPlayer(hand: CardModel[], playerIndex: number) {
    //================================for multiple card appending
    if (playerIndex === 0) {
      console.log('player1');
      setPlayer1Cards(prevState => {
        return [...prevState, ...hand];
      });
    } else if (playerIndex === 1) {
      console.log('player2');
      setPlayer2Cards(prevState => {
        return [...prevState, ...hand];
      });
    } else if (playerIndex === 2) {
      console.log('player3');
      setPlayer3Cards(prevState => {
        return [...prevState, ...hand];
      });
    } else if (playerIndex === 3) {
      console.log('player4');
      setPlayer4Cards(prevState => {
        return [...prevState, ...hand];
      });
    }
  }

  function hitCardToPitch(card: CardModel, turn: number) {}
  function dealCardToPlayer(card: CardModel, playerIndex: number) {
    //================================for one card appending
    if (playerIndex === 0) {
      setPlayer1Cards(prevState => {
        return [...prevState, card];
      });
    } else if (playerIndex === 1) {
      setPlayer2Cards(prevState => {
        return [...prevState, card];
      });
    } else if (playerIndex === 2) {
      setPlayer3Cards(prevState => {
        return [...prevState, card];
      });
    } else if (playerIndex === 3) {
      setPlayer4Cards(prevState => {
        return [...prevState, card];
      });
    }
  }

  async function chooseHakemForFirstTimeAsync(dealingSpeed = 1) {
    let index = 0;
    const PLAYERS_COUNT = 4;
    while (cardDeck.length > 0) {
      const turn = index % PLAYERS_COUNT;
      await sleep(dealingSpeed);
      let card = cardDeck.splice(0, 1)[0];
      dealCardToPlayer(card, turn);
      if (card.Rank === 'A') {
        //turn player is hakem
        console.log('hakem is chosen, player:' + turn);
        setHakem(turn);
        return;
      }

      index++;
    }
  }

  async function initGameAsync() {
    setIsStarted(true);
    if (cardDeck.length === 0) {
      setCardDeck(shuffleDeck());
    }

    await chooseHakemForFirstTimeAsync();
    await sleep(1);
    await collectCards();
    await dealCardsForAllAsync();
    //renderHakemMessage();
  }

  function renderHakemMessage() {
    Alert.alert(
      'Hakem',
      'Player ' + (hakem + 1) + ' is Hakem',
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      {cancelable: false},
    );
  }
  async function collectCards() {
    setPlayer1Cards([]);
    setPlayer2Cards([]);
    setPlayer3Cards([]);
    setPlayer4Cards([]);
    await sleep(1);
    return Promise.resolve(() => true);
  }

  async function dealCardsForAllAsync() {
    const CARDS_COUNT = [5, 4, 4];
    for (let i = 0; i < 3; i++) {
      for (let pIndex = 0; pIndex < 4; pIndex++) {
        const playerIndex = (hakem + pIndex) % 4;
        const hand: CardModel[] = [];
        for (let count = 0; count < CARDS_COUNT[i]; count++) {
          const card = cardDeck.pop();
          if (card !== undefined) {
            hand.push(card);
          }
        }
        console.log('playerIndex', playerIndex);
        batchDealToPlayer(hand, playerIndex);

        await sleep(0.5);
      }
    }
  }

  return (
    <View style={styles.container}>
      <PitchCardsContainerView
        northCard={pitchCards[2]}
        eastCard={pitchCards[1]}
        westCard={pitchCards[3]}
        southCard={pitchCards[0]}></PitchCardsContainerView>

      <ScoreBoardView
        style={styles.scoreBoard}
        team1={gameStatistics.team1}
        team2={gameStatistics.team2}></ScoreBoardView>

      <View key="south" style={styles.southPlayer}>
        <HandCardsView
          cards={player1Cards}
          isHakem={hakem === 0}
          showFront={true}></HandCardsView>
      </View>

      <View key="east" style={styles.eastPlayer}>
        <HandCardsView
          cards={player2Cards}
          isHakem={hakem === 1}
          showFront={hakem < 0 ? true : false}></HandCardsView>
      </View>

      <View key="north" style={styles.northPlayer}>
        <HandCardsView
          cards={player3Cards}
          isHakem={hakem === 2}
          showFront={hakem < 0 ? true : false}></HandCardsView>
      </View>

      <View key="west" style={styles.westPlayer}>
        <HandCardsView
          cards={player4Cards}
          isHakem={hakem === 3}
          showFront={hakem < 0 ? true : false}></HandCardsView>
      </View>

      {!isStarted && (
        <Button
          title="Start Round"
          onPress={async () => await initGameAsync()}></Button>
      )}
      {}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
    // background-image: radial-gradient(at 47% 33%, hsl(162, 77%, 40%) 0, transparent 59%), radial-gradient(at 82% 65%, hsl(222.55, 50%, 22%) 0, transparent 55%);

    flex: 1,
    position: 'relative',
  },

  scoreBoard: {
    position: 'absolute',
  },

  northPlayer: {
    top: '-49%',
    transform: [{rotate: '180deg'}],
  },

  westPlayer: {
    left: '85%',
    top: '8%',
    transform: [{rotate: '270deg'}],
  },

  eastPlayer: {
    left: '-85%',
    top: '7.5%',
    transform: [{rotate: '90deg'}],
  },

  southPlayer: {
    top: '68%',
  },
});
