import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import CardView from './CardView';
import {CardModel} from '../dataModels/CardModel';

interface PitchCardElementViewProps {
  style?: ViewStyle | ViewStyle[];
  card: CardModel | null | string; // You might want to define a more specific type for 'card'
}

const PitchCardElementView: React.FC<PitchCardElementViewProps> = ({
  style,
  card,
}) => {
  return (
    <View style={style}>
      <CardView
        isHumanPlayer={false}
        onClick={_ => {}}
        card={card}
        style={styles.pitchCard}
        showFront={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pitchCard: {
    height: 150,
    width: 95,
    maxHeight: 150,
    maxWidth: 95,
    resizeMode: 'contain',
  },
});

export default PitchCardElementView;
