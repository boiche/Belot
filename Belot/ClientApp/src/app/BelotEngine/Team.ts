import Player from "./Player";

class Team {
  name: string;
  players: Player[];

  constructor(name: string, player1: Player, player2: Player) {
    this.name = name;
    this.players = [];
    this.players.push(player1, player2);
  }
}

export default Team
