import { GameAnnouncement } from "./Announcement";
import Team from "./Team";

class BelotGame {
  playerToPlay!: 0 | 1 | 2 | 3;
  currentAnnounce!: GameAnnouncement;
  teams: Team[];

  constructor() {
    this.teams = [];    
  }
}

export default BelotGame
