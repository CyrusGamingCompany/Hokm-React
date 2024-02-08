import {CardModel, Suit} from './CardModel';
import {HokmTrickData} from './HokmTrickData';

export class HokmRoundData {
  cardDeck: CardModel[] = [];
  winnerTeamIndex: number = -1;
  hakemIndex: number = -1;
  isOver: boolean = false;
  hokmSuit: Suit | undefined;
  tricks: HokmTrickData[] = [new HokmTrickData()];

  roundNumber: number = -1;
  team1_trickPoints: number = 0;
  team2_trickPoints: number = 0;
  player1Hand: CardModel[] = [];
  player2Hand: CardModel[] = [];
  player3Hand: CardModel[] = [];
  player4Hand: CardModel[] = [];

  lastTrickIndex(): number {
    return this.tricks.length > 0
      ? this.tricks[this.tricks.length - 1].trickNumber
      : -1;
  }

  currentTrick(): HokmTrickData {
    if (this.tricks.length === 0) {
      throw new Error('No tricks available in the round.');
    }
    return this.tricks[this.tricks.length - 1];
  }

  toString(): string {
    return `
      Is Over: ${this.isOver}
      Round Number: ${this.roundNumber}
      currentTrickIndex: ${this.lastTrickIndex()}
      tricksCount: ${this.tricks.length}
      tricksIndices: [${this.tricks.map(trick => trick.trickNumber).join(',')}]
      lastTrickIndex: ${this.tricks[this.tricks.length - 1].trickNumber}
      Hakem Index: ${this.hakemIndex}
      Hokm Suit: ${this.hokmSuit}
      Winner Team Index: ${this.winnerTeamIndex}

      CardDeck Count: [${this.cardDeck.length}],
      Player1Hand Count: [${this.player1Hand.length}],
      Player2Hand Count: [${this.player2Hand.length}],
      Player3Hand Count: [${this.player3Hand.length}],
      Player4Hand Count: [${this.player4Hand.length}]
    `;
  }

  static newRound(
    roundNumber: number,
    hakemIndex: number,
    cardDeck: CardModel[],
  ): HokmRoundData {
    const newRound = new HokmRoundData();
    newRound.roundNumber = roundNumber;
    newRound.hakemIndex = hakemIndex;
    newRound.cardDeck = cardDeck;
    return newRound;
  }
}
