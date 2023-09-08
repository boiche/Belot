type PlayerNumber = 0 | 1 | 2 | 3;

type GameScoreType = 0 | 1 | 2;

type OddPlayerConfugiration = {
  allignFuncs: {
    x: (middleIndex: number, i: number, count: number) => number;
    y3: (i: number, playerIndex: number) => number;
    y5: (i: number, playerIndex: number) => number;
    y8: (i: number, playerIndex: number) => number;
    rotate: (middleIndex: number, i: number) => number;
  },
  initAngle: number,
  middlePoint: Phaser.Geom.Point,
  goalPoint: Phaser.Geom.Point,
  collectPoint: Phaser.Geom.Point
};

type EvenPlayerConfiguration = {
  allignFuncs: {
    y: (middleIndex: number, i: number, count: number) => number;
    x3: (i: number, playerIndex: number) => number;
    x5: (i: number, playerIndex: number) => number;
    x8: (i: number, playerIndex: number) => number;
    rotate: (middleIndex: number, i: number) => number;
  },
  initAngle: number,
  middlePoint: Phaser.Geom.Point,
  goalPoint: Phaser.Geom.Point,
  collectPoint: Phaser.Geom.Point
};

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
  width: number;

}
