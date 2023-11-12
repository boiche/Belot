import { GameObjects } from "phaser";

class Announcement {
  text: string;
  announcer!: PlayerNumber;

  constructor(text: string) {
    this.text = text;
  }

  public static GetText(type: HandAnnouncementType | GameAnnouncementType | undefined): string {
  switch (type) {
    case HandAnnouncementType.BELOT: return "BELOT";
    case HandAnnouncementType.FOAK: return "FOAK";
    case HandAnnouncementType.QUARTA: return "QUARTA";
    case HandAnnouncementType.QUINTA: return "QUINTA";
    case HandAnnouncementType.TERCA: return "TERCA";
    case HandAnnouncementType.TWO_TERCA: return "TWO TERCA";
    case GameAnnouncementType.ALLSUITS: return "ALLSUITS";
    case GameAnnouncementType.CLUBS: return "CLUBS";
    case GameAnnouncementType.DIAMONDS: return "DIAMONDS";
    case GameAnnouncementType.DOUBLE: return "DOUBLE";
    case GameAnnouncementType.HEARTS: return "HEARTS";
    case GameAnnouncementType.NOSUIT: return "NOSUIT";
    case GameAnnouncementType.PASS: return "PASS";
    case GameAnnouncementType.REDOUBLE: return "REDOUBLE";
    case GameAnnouncementType.SPADES: return "SPADES";
    default: return "";
  }
}
}

class GameAnnouncement extends Announcement {
  type: GameAnnouncementType;
  static empty: GameAnnouncement = new GameAnnouncement(0, '');

  constructor(type: GameAnnouncementType, text: string) {
    super(text);
    this.type = type;
  }
}

class HandAnnouncement extends Announcement {
  type: HandAnnouncementType;
  details: HandAnnouncementDetails;

  constructor(type: HandAnnouncementType, text: string) {
    super(text);
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
