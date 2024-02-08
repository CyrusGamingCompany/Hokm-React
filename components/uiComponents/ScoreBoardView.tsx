import {View, ViewStyle} from 'react-native';
import TeamScoreView from './TeamScoreView';
import React from 'react';

export interface ScoreBoardViewProps {
  team1: {
    name: string;
    trickScore: number;
  };
  team2: {
    name: string;
    trickScore: number;
  };
  style?: ViewStyle; // style is optional and should be of type ViewStyle
}

// Use the interface for the component's props
const ScoreBoardView: React.FC<ScoreBoardViewProps> = props => {
  return (
    <View style={[props.style, {flexDirection: 'column'}]}>
      <TeamScoreView
        teamName={props.team1.name}
        trickScore={props.team1.trickScore}
      />
      <TeamScoreView
        teamName={props.team2.name}
        trickScore={props.team2.trickScore}
      />
    </View>
  );
};

export default ScoreBoardView;
