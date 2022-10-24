import { Scene } from "phaser"
import Card from 'src/app/GameObjects/Card'

class GameTableScene extends Scene{
  constructor() {
    super('PlayBelot');
  }

  cards: Card[] = [];

  create() {
    this.add.image(0, 0, "tableCloth").setSize(window.innerWidth, window.innerHeight).setVisible(true);
    this.deal()
  }

  deal() {

  }
}

export default GameTableScene
