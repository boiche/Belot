import Card from "../GameObjects/Card";

class Player {
  constructor(username: string, playerIndex: number, team: Teams) {
    this.playerIndex = playerIndex;
    this.username = username;
    this.playingHand = [];
    this.team = team;
  }

  playerIndex: number;
  username: string;
  isOnTurn: boolean = false;
  playingHand: Card[];
  team: Teams;
}

enum Teams {
  TeamA,
  TeamB
}
export default Player
