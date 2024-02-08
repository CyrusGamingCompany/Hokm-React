import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';
import CardView from './CardView';
import {CardModel} from '../dataModels/CardModel';
import PropTypes from 'prop-types';
type CardType = any;
type HandCardsViewProps = {
  shouldRotate: boolean;
  cards: CardType[];
  showFront: boolean;
  isHakem: boolean;
  isHumanPlayer: boolean;
  isTurn: boolean;
  onClickFunc: ((card: CardType) => void) | undefined;
};

export default function HandCardsView({
  cards,
  showFront,
  isHakem,
  isHumanPlayer,
  isTurn,
  onClickFunc,
  shouldRotate,
}: HandCardsViewProps) {
  //const cardItemsElements = cards.sort(); // You should replace this with the actual sorting logic

  const cardItems = cards.map((card, index) => {
    let cardStyle: ViewStyle = {
      position: 'absolute',
      left: '45%',
      top: -220,
    };

    if (shouldRotate) {
      cardStyle = {
        ...cardStyle,
        ...rotation(showFront, index, cards.length),
      };
    }

    return (
      <CardView
        key={index}
        isHumanPlayer={isHumanPlayer}
        card={card}
        showFront={showFront}
        onClick={() => onClickFunc && onClickFunc(card)}
        style={cardStyle}
      />
    );
  });

  const handlePress = (event: GestureResponderEvent) => {
    console.log('Clicked!');
  };

  return (
    <View style={styles.playerSide}>
      {isTurn && (
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      )}

      <View key={'HakemIcon'}>
        <Image
          source={require('../../assets/images/VintagePlayingCards/Hakem.png')}
          style={[
            styles.hakemIcon,
            {left: isHakem ? '45%' : '25%', top: isHakem ? -260 : -200},
            !isHakem && {display: 'none'},
          ]}
        />
      </View>

      <View style={styles.cardsContainer}>{cardItems}</View>
    </View>
  );
}

function rotation(showFront: boolean, index: number, count: number): ViewStyle {
  return showFront
    ? masterPlayerRotation(index, count)
    : otherPlayersRotation(index, count);
}
function otherPlayersRotation(index: number, count: number): ViewStyle {
  const rotate = index * 4 - 1.5 * count - 4;
  return {
    transform: [{rotate: `${rotate}deg`}],
    transformOrigin: '20px 100px',
  };
}

function masterPlayerRotation(index: number, count: number): ViewStyle {
  const rotate = index * 7 - 3.46 * count - 5;
  return {
    transform: [{rotate: `${rotate}deg`}],
    transformOrigin: '20px 249px',
  };
}

const styles = StyleSheet.create({
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'black',
    marginTop: 'auto',
  },

  playerSide: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'blue',
    borderWidth: 1,
    position: 'absolute',
    width: 40,
    height: 35,
    left: '45%',
    top: -300,
  },

  hakemIcon: {
    position: 'absolute',
    width: 40,
    height: 35,
    resizeMode: 'stretch',
  },
});
