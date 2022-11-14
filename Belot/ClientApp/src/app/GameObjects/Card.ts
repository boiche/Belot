class Card {
  constructor(suit: number, rank: number, sprite: Phaser.GameObjects.Sprite) {
    this.suit = suit;
    this.rank = rank;
    this.sprite = sprite;
    this.dealt = false;
  }

  suit: Suit = Suit.DIAMOND;
  rank: Rank = Rank.SEVEN;
  dealt: boolean;
  sprite: Phaser.GameObjects.Sprite;

  equal(card: Card) {
    return card.rank === this.rank && card.suit === this.suit;
  }
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
