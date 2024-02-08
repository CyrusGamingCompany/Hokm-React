import {GamePhase} from './GamePhase';
import HokmGameSettings, {initialGameSettings} from './HokmGameSettings';
import {HokmRoundData} from './HokmRoundData';

export class HokmGameData {
  gameSettings: HokmGameSettings = initialGameSettings;
  gamePhase: GamePhase = GamePhase.NotStarted;
  rounds: HokmRoundData[] = [new HokmRoundData()];
  team1_roundPoints: number = 0;
  team2_roundPoints: number = 0;
}
