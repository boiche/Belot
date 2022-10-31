import Card from "../GameObjects/Card";
import { HandAnnouncement, GameAnnouncement, HandAnnouncementType } from "./Announcement";

class Player {
  constructor(playingHand: Card[] | undefined, username: string) {
    this.playingHand = playingHand;
    this.username = username;
  }

  username: string;
  playingHand: Card[] | undefined;

  checkTerca(): HandAnnouncement | null {
    var sorted = this.playingHand?.sort(
      (x: Card, y: Card) =>
      {
        if (x.rank === y.rank)
          return 0;
        else
          return x.rank > y.rank ? -1 : 1;
      });

    if (true) {
      return new HandAnnouncement(HandAnnouncementType.TWO_TERCA);
    }
    else if (true) {
      return new HandAnnouncement(HandAnnouncementType.TERCA);
    }
    else {
      return null;
    }
  }

  checkQuarta(): HandAnnouncement | null {
    throw "Not implemented";
  }

  checkQuinta(): HandAnnouncement | null {
    throw "Not implemented";
  }

  checkFourOfAKind(): HandAnnouncement | null {
    throw "Not implemented";
  }

  checkBelot(): HandAnnouncement | null {
    throw "Not implemented";
  }
}

export default Player
