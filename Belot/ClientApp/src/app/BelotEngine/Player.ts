import { Card, Suit } from "../GameObjects/Card";
import { GameAnnouncementType } from "./Announcement";

export default class Player {
  constructor(username: string, playerIndex: number, team: Teams) {
    this.playerIndex = playerIndex;
    this.username = username;
    this.playingHand = [];
    this.team = team;
  }

  playerIndex: number;
  username: string;
  isOnTurn: boolean = false;
  /** This field contains the cards sorted */
  playingHand: Card[];
  team: Teams;

  public sortPlayingHand(playingHand: Card[], announcement: GameAnnouncementType): Card[] {
    var sortedPlayingHand: Card[] = [];
    switch (announcement) {
      case GameAnnouncementType.CLUBS: {
        var diamonds = playingHand.filter(x => x.suit === Suit.CLUB).sort((x, y) => this.SuitComparison(x, y));
        var nonDiamonds = playingHand.filter(x => x.suit !== Suit.CLUB);

        for (var i = 0; i < diamonds.length; i++) {
          sortedPlayingHand.push(diamonds[i]);
        }

        for (var i = 0; i < 4; i++) {
          if (i == Suit.CLUB) {
            continue;
          }
          var currentSuit = nonDiamonds.filter(x => x.suit === i).sort((x, y) => this.NoSuitComparison(x, y));

          for (var y = 0; y < currentSuit.length; y++) {
            sortedPlayingHand.push(currentSuit[y]);
          }
        }
      } break;
      case GameAnnouncementType.DIAMONDS: {
        var diamonds = playingHand.filter(x => x.suit === Suit.DIAMOND).sort((x, y) => this.SuitComparison(x, y));
        var nonDiamonds = playingHand.filter(x => x.suit !== Suit.DIAMOND);

        for (var i = 0; i < diamonds.length; i++) {
          sortedPlayingHand.push(diamonds[i]);
        }

        for (var i = 0; i < 4; i++) {
          if (i == Suit.DIAMOND) {
            continue;
          }
          var currentSuit = nonDiamonds.filter(x => x.suit === i).sort((x, y) => this.NoSuitComparison(x, y));

          for (var y = 0; y < currentSuit.length; y++) {
            sortedPlayingHand.push(currentSuit[y]);
          }
        }
      } break;
      case GameAnnouncementType.HEARTS: {
        var hearts = playingHand.filter(x => x.suit === Suit.HEART).sort((x, y) => this.SuitComparison(x, y));
        var nonHearts = playingHand.filter(x => x.suit !== Suit.HEART);

        for (var i = 0; i < hearts.length; i++) {
          sortedPlayingHand.push(hearts[i]);
        }

        for (var i = 0; i < 4; i++) {
          if (i == Suit.HEART) {
            continue;
          }
          var currentSuit = nonHearts.filter(x => x.suit === i).sort((x, y) => this.NoSuitComparison(x, y));

          for (var y = 0; y < currentSuit.length; y++) {
            sortedPlayingHand.push(currentSuit[y]);
          }
        }
      } break;
      case GameAnnouncementType.SPADES: {
        var spades = playingHand.filter(x => x.suit === Suit.SPADE).sort((x, y) => this.SuitComparison(x, y));
        var nonSpades = playingHand.filter(x => x.suit !== Suit.SPADE);

        for (var i = 0; i < spades.length; i++) {
          sortedPlayingHand.push(spades[i]);
        }

        for (var i = 0; i < 4; i++) {
          if (i == Suit.SPADE) {
            continue;
          }
          var currentSuit = nonSpades.filter(x => x.suit === i).sort((x, y) => this.NoSuitComparison(x, y));

          for (var y = 0; y < currentSuit.length; y++) {
            sortedPlayingHand.push(currentSuit[y]);
          }
        }
      } break;
      case GameAnnouncementType.ALLSUITS: {
        for (var i = 0; i < 4; i++) {
          var currentSuit = playingHand.filter(x => x.suit === i).sort((x, y) => this.SuitComparison(x, y));

          console.log("current suit to sort is: " + i);
          console.log("sorted suit");
          console.log(currentSuit);

          for (var y = 0; y < currentSuit.length; y++) {
            sortedPlayingHand.push(currentSuit[y]);
          }
        }
      } break;
      // NOSUIT, PASS
      default: {                
        for (var i = 0; i < 4; i++) {
          var currentSuit = playingHand.filter(x => x.suit === i).sort((x, y) => this.NoSuitComparison(x, y));

          console.log("current suit to sort is: " + i);
          console.log("sorted suit");
          console.log(currentSuit);

          for (var y = 0; y < currentSuit.length; y++) {
            sortedPlayingHand.push(currentSuit[y]);
          }
        }
      }
    }

    //NB: KEEP EYE ON THIS. COULD CAUSE UNEXPECTED BEHAVIOUR
    playingHand = sortedPlayingHand;    

    return sortedPlayingHand;
  }
  public getSortedIntersection(cards: Card[]): Card[] {
    var result: Card[] = [];    

    if (cards.length === this.playingHand.length) {
      return this.playingHand;
    }

    for (var i = 0; i < this.playingHand.length; i++) {
      cards.forEach(x => {
        if (this.playingHand[i].equal(x)) {
          result.push(this.playingHand[i]);
          return;
        }
      });
    }

    return result;
  }

  private NoSuitComparison(x: Card, y: Card): number {
    return new Card(x.suit, x.rank, x.sprite).NoSuitStrength - new Card(y.suit, y.rank, y.sprite).NoSuitStrength;
  }
  private SuitComparison(x: Card, y: Card): number {
    return new Card(x.suit, x.rank, x.sprite).SuitStrength - new Card(y.suit, y.rank, y.sprite).SuitStrength;
  }
}

enum Teams {
  TeamA,
  TeamB
}
