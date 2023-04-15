import { GameObjects } from "phaser";

class Announcement {
  text: string;
  announcer!: 0 | 1 | 2 | 3;

  constructor(text: string) {
    this.text = text;
  }
}

class GameAnnouncement extends Announcement {
  type: GameAnnouncementType;
  static empty: GameAnnouncement = new GameAnnouncement(0);

  constructor(type: GameAnnouncementType | number) {
    super(type.toString());
    this.type = type;
  }
}

class HandAnnouncement extends Announcement {
  type: HandAnnouncementType;
  details: HandAnnouncementDetails;

  constructor(type: HandAnnouncementType) {
    super(type.toString());
    this.type = type;
    this.details = new HandAnnouncementDetails();
  }
}

class HandAnnouncementDetails {
  lowestRank!: number;
  highestRank!: number;
  sprites!: GameObjects.Sprite[];
}

enum GameAnnouncementType {
  PASS,
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
  NOSUIT,
  ALLSUITS,
  DOUBLE,
  REDOUBLE,
}

enum HandAnnouncementType {
  TERCA = 20,
  TWO_TERCA = 40,
  QUARTA = 50,
  QUINTA = 100,
  FOAK = 100,
  BELOT = 21
}

export { Announcement, HandAnnouncement, GameAnnouncement, GameAnnouncementType, HandAnnouncementType }
