import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageSourcePropType,
  ViewStyle,
  StyleProp,
  ImageStyle,
} from 'react-native';
import getCardImage from '../logic/CardsData';
import {CardModel} from '../dataModels/CardModel';

type CardViewProps = {
  card: CardModel | null;
  isHumanPlayer: boolean;
  showFront: boolean;
  style?: ViewStyle;
  onClick: ((card: CardModel) => void) | null;
};

const CardView: React.FC<CardViewProps> = props => {
  const frontCard = {
    source: getCardImage(props.card),
    style: styles.playerCard,
    viewStyle: props.style,
  };

  const backCard = {
    source: getCardImage('Back'),
    style: styles.otherCards,
    viewStyle: props.style,
  };

  if (props.isHumanPlayer) {
    return (
      <ClickableCardView
        {...frontCard}
        onClick={props.onClick}
        card={props.card}
      />
    );
  } else {
    if (props.showFront) {
      return <NotClickableCardView {...frontCard} />;
    } else {
      return <NotClickableCardView {...backCard} />;
    }
  }
};

// Define the type for the props expected by the NotClickableCard component
type NotClickableCardViewProps = {
  source: ImageSourcePropType;
  style: StyleProp<ImageStyle>;
  viewStyle?: ViewStyle;
};

const NotClickableCardView: React.FC<NotClickableCardViewProps> = ({
  source,
  style,
  viewStyle,
}) => {
  return (
    <View style={[viewStyle]}>
      <Image source={source} style={[style]} />
    </View>
  );
};

// Define the type for the props expected by the ClickableCard component
type ClickableCardViewProps = NotClickableCardViewProps & {
  onClick: ((card: CardModel) => void) | null;
  card: CardModel | null;
};

const ClickableCardView: React.FC<ClickableCardViewProps> = ({
  source,
  style,
  viewStyle,
  onClick,
  card,
}) => {
  const [isSelected, setSelected] = useState(false);

  const handlePress = () => {
    handleClick();
    setSelected(true);
  };

  const handleLongPress = () => {
    console.log('Long Pressed!');
  };

  const handleClick = () => {
    console.log('Clicked!');
    onClick && onClick(card);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={[viewStyle, isSelected && styles.selectedCard]}>
      <Image source={source} style={style} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  otherCards: {
    borderRadius: 10,
    height: 75,
    width: 47.5,
    maxHeight: 75,
    maxWidth: 47.5,
    resizeMode: 'contain',
  },
  playerCard: {
    borderRadius: 18,
    height: 150,
    width: 95,
    maxHeight: 150,
    maxWidth: 95,
    resizeMode: 'contain',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#333',
  },
});

export default CardView;
