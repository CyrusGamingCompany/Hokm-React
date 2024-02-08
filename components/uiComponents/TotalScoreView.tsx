import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
type TotalScoreViewProps = {
  team1TotalScore: number;
  team2TotalScore: number;
};

const TotalScoreView: React.FC<TotalScoreViewProps> = props => {
  return (
    <View style={styles.totalScore}>
      <Text id="comTeam-totalPoints" style={styles.comTeamTotalPoints}>
        Team-1 Total Points: {props.team1TotalScore}
      </Text>
      <Text id="ourTeam-totalPoints" style={styles.ourTeamTotalPoints}>
        Team-2 Total Points: {props.team2TotalScore}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  totalScore: {
    position: 'absolute',
    margin: 10,
  },
  comTeamTotalPoints: {
    backgroundColor: 'salmon',
    fontSize: 20,
    position: 'absolute',
    width: 20,
    top: 0,
  },

  ourTeamTotalPoints: {
    backgroundColor: 'limegreen',
    fontSize: 20,
  },
});

export default TotalScoreView;
