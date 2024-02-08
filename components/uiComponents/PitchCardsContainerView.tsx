import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import PitchCardElementView from './PitchCardElementView';
import {CardModel} from '../dataModels/CardModel';

interface PitchCardsContainerProps {
  northCard: CardModel | null;
  westCard: CardModel | null;
  eastCard: CardModel | null;
  southCard: CardModel | null;
}

const PitchCardsContainerView: React.FC<PitchCardsContainerProps> = ({
  northCard,
  westCard,
  eastCard,
  southCard,
}) => {
  return (
    <View style={styles.pitch}>
      {renderPitchCard(northCard, [styles.teammate, styles.north])}

      <View style={styles.opposite}>
        {renderPitchCard(westCard, styles.west)}
        {renderPitchCard(eastCard, styles.east)}
      </View>

      {renderPitchCard(southCard, [styles.teammate, styles.south])}
    </View>
  );
};

const renderPitchCard = (card: CardModel | null, inputStyle: any) => {
  if (!card || card === null) {
    return (
      <PitchCardElementView card={'Back'} style={[inputStyle, styles.hide]} />
    );
  }

  return <PitchCardElementView card={card} style={inputStyle} />;
};

PitchCardsContainerView.propTypes = {
  northCard: PropTypes.instanceOf(CardModel),
  westCard: PropTypes.instanceOf(CardModel),
  eastCard: PropTypes.instanceOf(CardModel),
  southCard: PropTypes.instanceOf(CardModel),
};

const styles = StyleSheet.create({
  pitch: {
    position: 'relative',
    margin: 20,
    width: '50%',
    height: '28%',
    left: '22%',
    top: '20%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  opposite: {
    flexDirection: 'row',
    justifyContent: 'center',
    top: '-15%',
  },
  teammate: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  south: {
    top: '-50%',
  },
  north: {
    top: '10%',
  },
  east: {
    left: '10%',
  },
  west: {
    left: '-10%',
  },
  hide: {
    opacity: 0,
  },
});

export default PitchCardsContainerView;
