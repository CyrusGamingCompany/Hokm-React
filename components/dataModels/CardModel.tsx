export interface ICardModel {
  Suit: Suit;
  Rank: string;
}

export class CardModel implements ICardModel {
  Suit: Suit;
  Rank: string;
  constructor(suit: Suit, rank: string) {
    this.Suit = suit;
    this.Rank = rank;
  }

  public toString(): string {
    return `${suitToString(this.Suit)}_${this.Rank}`;
  }

  public toLogString(): string {
    if (this.Suit === Suit.Hearts) {
      return `♥_${this.Rank}`;
    }
    if (this.Suit === Suit.Diamonds) {
      return `♦_${this.Rank}`;
    }
    if (this.Suit === Suit.Clubs) {
      return `♣_${this.Rank}`;
    }
    if (this.Suit === Suit.Spades) {
      return `♠_${this.Rank}`;
    }
    return 'ERROR';
  }

  GetRankValue(): number {
    if (this.Rank === undefined || this.Rank === null) {
      return 0;
    }

    switch (this.Rank) {
      case 'A':
        return 14;
      case 'K':
        return 13;
      case 'Q':
        return 12;
      case 'J':
        return 11;
      default:
        return parseInt(this.Rank);
    }
  }

  GetValue(currentSuit: Suit, hokmSuit: Suit): number {
    if (currentSuit == null || hokmSuit == null) {
      throw new Error('Both currentSuit and hokmSuit must be provided.');
    }

    if (currentSuit === undefined || hokmSuit === undefined) {
      throw new Error('Both currentSuit and hokmSuit must be provided.');
    }

    if (this.Rank === undefined || this.Rank === null) {
      return 0;
    }

    if (this.Suit === hokmSuit) {
      return this.GetRankValue() + 100;
    }
    if (this.Suit === currentSuit) {
      return this.GetRankValue() + 10;
    }

    return this.GetRankValue();
  }
}

export enum Suit {
  Hearts = '♥',
  Clubs = '♣',
  Spades = '♠',
  Diamonds = '♦',
}

export const suitToString = (suit: Suit): string => {
  switch (suit) {
    case Suit.Hearts:
      return 'Hearts';
    case Suit.Clubs:
      return 'Clubs';
    case Suit.Spades:
      return 'Spades';
    case Suit.Diamonds:
      return 'Diamonds';
    default:
      // Handle unexpected values
      return 'Unknown Suit';
  }
};
