import { GameAnnouncement } from "./Announcement";
import Team from "./Team";
import { Guid } from 'guid-typescript'
import Player from "./Player";

class BelotGame {
  playerToPlay!: 0 | 1 | 2 | 3;
  currentAnnounce!: GameAnnouncement | null;
  counter!: GameAnnouncement | null;
  teams: Team[] = [];

  constructor() {
    for (var i = 0; i < 2; i++) {
      this.teams.push(new Team(Guid.create().toString(), new Player(undefined, 'username'), new Player(undefined, 'username')));
    } 
  }
}

export default BelotGame
