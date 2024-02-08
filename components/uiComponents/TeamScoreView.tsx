import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type TeamScoreViewProps = {
  teamName: string;
  trickScore: number;
};

const TeamScoreView: React.FC<TeamScoreViewProps> = ({
  teamName,
  trickScore: score,
}) => {
  // Assuming you want to generate a random color, you can implement a function for it
  const randomColor = `#`;

  return (
    <View style={[styles.container, {backgroundColor: randomColor}]}>
      <View style={styles.stat}>
        <Text style={styles.title}>{teamName}</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
  },

  stat: {
    flexDirection: 'column',
  },

  title: {
    color: 'rgb(197, 194, 194)',
    fontSize: 18,
    height: 25,
  },

  scoreValue: {
    fontSize: 25,
    lineHeight: 25,
    color: 'white',
    alignContent: 'center',
    verticalAlign: 'bottom',
    top: 5,
    fontWeight: '800',
  },
});

export default TeamScoreView;
