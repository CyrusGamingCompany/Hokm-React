export default interface HokmGameSettings {
  Team1Name: string;
  Team2Name: string;

  Player1Name: string;
  Player2Name: string;
  Player3Name: string;
  Player4Name: string;
}

export const initialGameSettings: HokmGameSettings = {
  Player1Name: 'You',
  Player2Name: 'east',
  Player3Name: 'north',
  Player4Name: 'west',
  Team1Name: 'our-team',
  Team2Name: 'AI-team',
};
