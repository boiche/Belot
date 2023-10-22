type PlayerNumber = 0 | 1 | 2 | 3;

type GameScoreType = 0 | 1 | 2;

/**
 * 
 * Configuration for appearance of odd placed players on the table.
 * 
 */
type OddPlayerConfugiration = {
  /** Functions to place the cards in proper way for each quantity left in play. */
  allignFuncs: {
    x: (middleIndex: number, i: number, count: number) => number;
    y3: (i: number, playerIndex: number) => number;
    y5: (i: number, playerIndex: number) => number;
    y8: (i: number, playerIndex: number) => number;
    rotate: (middleIndex: number, i: number) => number;
  },
  /**
 * The initial tilt angle of the cards
 */
  initAngle: number,
  specifics: PlayerSpecifics
};

/**
 * 
 * Configuration for appearance of even placed players on the table.
 * 
 */
type EvenPlayerConfiguration = {
  /** Functions to place the cards in proper way for each quantity left in play. */
  allignFuncs: {
    y: (middleIndex: number, i: number, count: number) => number;
    x3: (i: number, playerIndex: number) => number;
    x5: (i: number, playerIndex: number) => number;
    x8: (i: number, playerIndex: number) => number;
    rotate: (middleIndex: number, i: number) => number;
  },
  /**
   * The initial tilt angle of the cards
   */
  initAngle: number,
  /**
   * This section defines specific configuration that has to be configured outside
   */
  specifics: PlayerSpecifics 
};

/**
* Defines specific configuration that has to be configured outside
*/
type PlayerSpecifics = {
  /** The point that sets the hand of the player symmetrically  */
  middlePoint: Phaser.Geom.Point,
  /** The point which the dealt cards must reach */
  goalPoint: Phaser.Geom.Point,
  /** The point which the collected cards must reach */
  collectPoint: Phaser.Geom.Point
}

type SidebarConfiguration = {
  name: string;
  width: number;
  mainColor: number;
  secondaryColor: number;
  point: Phaser.Geom.Point;
  orientation: 'left' | 'right'
};

type TotalScoreConfiguration = {
  name: string;
  fontStyle: Phaser.Types.GameObjects.Text.TextStyle;
  width: number;
  originPoint: Phaser.Geom.Point;
};

type OptionsButtonConfiguration = {
  name: string;
  originPoint: Phaser.Geom.Point;
  hoverColor: number;
  width: number;
  height: number;
}

type HandAnnounementsRectangleConfiguration = {
  name: string;
  originPoint: Phaser.Geom.Point;
  fillColor: number;
  hoverColor: number;
  width: number;
  height: number;
}
