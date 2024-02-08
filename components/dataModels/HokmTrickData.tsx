import {CardModel, Suit} from './CardModel';

export class HokmTrickData {
  turn: number;
  isOver: boolean;
  leadSuit: Suit | undefined;
  starterPlayerIndex: number;
  pitchCards: (CardModel | null)[];
  trickNumber: number;
  winnerPlayerIndex: number;
  clickedCard: CardModel | undefined;

  constructor() {
    this.turn = -1;
    this.isOver = false;
    this.leadSuit = undefined;
    this.starterPlayerIndex = -1;
    this.pitchCards = [null, null, null, null];
    this.trickNumber = -1;
    this.winnerPlayerIndex = -1;
    this.clickedCard = undefined;
  }

  toString(): string {
    return (
      `HokmTrickData { ` +
      `turn: ${this.turn}, ` +
      `isOver: ${this.isOver}, ` +
      `leadSuit: ${this.leadSuit}, ` +
      `starterPlayerIndex: ${this.starterPlayerIndex}, ` +
      `pitchCards.Length: ${this.pitchCards.length}, ` +
      `trickNumber: ${this.trickNumber}, ` +
      `winnerPlayerIndex: ${this.winnerPlayerIndex}, `
    );
  }

  static newTrick(
    trickNumber: number,
    starterPlayerIndex: number,
  ): HokmTrickData {
    const newTrick = new HokmTrickData();
    newTrick.starterPlayerIndex = starterPlayerIndex;
    newTrick.trickNumber = trickNumber;
    newTrick.turn = starterPlayerIndex;
    return newTrick;
  }
}
