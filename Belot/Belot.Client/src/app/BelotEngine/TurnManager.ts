import GameAnnouncementsPopUp from "../GameObjects/PopUps/GameAnnouncementsPopUp"
import { Dealer } from "./Dealer";

class TurnManager {
  private announcementsPopUp: GameAnnouncementsPopUp;
  private dealer: Dealer;

  constructor(dealer: Dealer, announcements: GameAnnouncementsPopUp) {
    this.dealer = dealer;
    this.announcementsPopUp = announcements;
  }

  beforeThrow = (): void => {
    this.dealer._scene.currentPlayer.isOnTurn = true;
    this.dealer.enableCards();
  }

  announce = (): void => {
    if (this.dealer.firstDealReady) {
      this.announcementsPopUp.show();
      this.dealer._announcementsReady = false;
    }
    else {
      this.dealer._announcementsReady = true;
    }
  }
}

enum TurnCodes {
  Announcement,
  ThrowCard,
  CardAnnouncement //TODO: rename it (belot, quarta, FOAK...)
}

export { TurnManager, TurnCodes }
