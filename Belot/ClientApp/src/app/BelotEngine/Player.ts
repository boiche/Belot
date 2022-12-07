import Card from "../GameObjects/Card";

class Player {
  constructor(username: string, playerIndex: number) {
    this.playerIndex = playerIndex;
    this.username = username;
    this.playingHand = [];
  }

  playerIndex: number;
  username: string;
  isOnTurn: boolean = false;
  playingHand: Card[];
}

export default Player
