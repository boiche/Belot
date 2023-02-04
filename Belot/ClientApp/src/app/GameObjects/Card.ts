class Card {
  constructor(suit: number, rank: number, sprite: Phaser.GameObjects.Sprite) {
    this.suit = suit;
    this.rank = rank;
    this.sprite = sprite;
    this.dealt = false;
    this.frameIndex = -1;
  }

  suit: Suit = Suit.DIAMOND;
  rank: Rank = Rank.SEVEN;
  dealt: boolean;
  sprite: Phaser.GameObjects.Sprite;
  frameIndex: number;
  
  get SuitStrength() {
    switch (this.rank) {
      case Rank.SEVEN: return SingleSuit.SEVEN;
      case Rank.EIGHT: return SingleSuit.EIGHT;
      case Rank.QUEEN: return SingleSuit.QUEEN;
      case Rank.KING: return SingleSuit.KING;
      case Rank.TEN: return SingleSuit.TEN;
      case Rank.ACE: return SingleSuit.ACE;
      case Rank.NINE: return SingleSuit.NINE;
      case Rank.JACK: return SingleSuit.JACK;   
    }
  }

  get NoSuitStrength() {
    switch (this.rank) {
      case Rank.SEVEN: return NoSuit.SEVEN;
      case Rank.EIGHT: return NoSuit.EIGHT;
      case Rank.NINE: return NoSuit.NINE;
      case Rank.JACK: return NoSuit.JACK;
      case Rank.QUEEN: return NoSuit.QUEEN;
      case Rank.KING: return NoSuit.KING;
      case Rank.TEN: return NoSuit.TEN;
      case Rank.ACE: return NoSuit.ACE;            
    }
  }

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

// these enums are used to sort playing hands by strength
enum SingleSuit {
  SEVEN,
  EIGHT,
  QUEEN,
  KING,
  TEN,
  ACE,
  NINE,
  JACK
}

enum NoSuit {
  SEVEN,
  EIGHT,
  NINE,
  JACK,
  QUEEN,
  KING,
  TEN,
  ACE
}

export { Card, Suit, Rank }
