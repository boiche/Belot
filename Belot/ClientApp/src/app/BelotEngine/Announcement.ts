class Announcement {
  text: string;
  announcer!: 0 | 1 | 2 | 3;

  constructor(text: string) {
    this.text = text;
  }
}

class GameAnnouncement extends Announcement {
  type: GameAnnouncementType;

  constructor(type: GameAnnouncementType) {
    super(type.toString());
    this.type = type;
  }
}

class HandAnnouncement extends Announcement {
  type: HandAnnouncementType;

  constructor(type: HandAnnouncementType) {
    super(type.toString());
    this.type = type;
  }
}

enum GameAnnouncementType {
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
  NOSUIT,
  ALLSUITS,
  COUNTER,
  RECOUNTER
}

enum HandAnnouncementType {
  TERCA = 20,
  TWO_TERCA = 40,
  QUARTA = 50,
  QUINTA = 100,
  FOAK = 100,
  BELOT = 20
}

export { Announcement, HandAnnouncement, GameAnnouncement, GameAnnouncementType, HandAnnouncementType }
