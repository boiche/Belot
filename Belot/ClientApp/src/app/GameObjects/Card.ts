class Card {
  constructor(suit: number, rank: number) {
    this.suit = suit;
    this.rank = rank;
  }

  suit: Suit = Suit.DIAMOND;
  rank: Rank = Rank.SEVEN;
}

enum Suit {
  DIAMOND,
  HEART,
  CLUB,
  SPADE
}

enum Rank {
  SEVEN = 7,
  EIGHT,
  NINE,
  TEN,
  JACK,
  QUEEN,
  KING,
  ACE
}

export default Card
