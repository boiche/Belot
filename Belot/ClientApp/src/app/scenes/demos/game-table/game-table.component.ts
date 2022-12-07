import { DOWN, LEFT, RIGHT, Scene, UP } from 'phaser'
import { gameOptions } from '../../../../main';

export class GameTableSceneDemo extends Scene {
  constructor() {
    super('PlayGame')
  }

  boardArray: { tileValue: number, tileSprite: Phaser.GameObjects.Sprite, upgraded: boolean }[][] = [];
  canMove: boolean = true;
  movingTiles = 0;
  a = 2;

  create() {
    for (var i = 0; i < 4; i++) {
      this.boardArray[i] = [];
      for (var j = 0; j < 4; j++) {
        var tilePosition = this.getTilePosition(i, j);
        this.add.image(tilePosition.x, tilePosition.y, "emptytile");
        var tile = this.add.sprite(tilePosition.x, tilePosition.y, "tiles", 0);
        tile.visible = false;
        this.boardArray[i][j] = {
          tileValue: 0,
          tileSprite: tile,
          upgraded: false
        }
      }
    }
    this.addTile();
    this.addTile();

    this.input.keyboard.on("keydown", this.handleKey, this);
    this.input.on("pointerup", this.handleSwipe, this);
  }

  getTilePosition(row: number, col: number): Phaser.Geom.Point {
    //var posX = gameOptions.tileSpacing * (col + 1) + gameOptions.cardWidth *
    //  (col + 0.5);
    //var posY = gameOptions.tileSpacing * (row + 1) + gameOptions.cardHeight *
    //  (row + 0.5);
    return new Phaser.Geom.Point(1, 1);
  }

  addTile() {
    //var emptyTiles = [];
    //for (var i = 0; i < gameOptions.boardSize.rows; i++) {
    //  for (var j = 0; j < gameOptions.boardSize.cols; j++) {
    //    if (this.boardArray[i][j].tileValue == 0) {
    //      emptyTiles.push({
    //        row: i,
    //        col: j
    //      })
    //    }
    //  }
    //}
    //if (emptyTiles.length > 0) {
    //  var chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);

    //  this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1;
    //  this.boardArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
    //  this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
    //  this.boardArray[chosenTile.row][chosenTile.col].tileSprite.alpha = 0;

      //var tweenConfig = {
      //  targets: [this.boardArray[chosenTile.row][chosenTile.col].tileSprite],
      //  duration: gameOptions.tweens,
      //  alpha: 1,
      //  callbackScope: this,
      //  onComplete: function () {
      //    console.log("tween completed");
      //  }
      //}

    //  this.tweens.add(tweenConfig);
    //}
  }

  handleKey(e: any) {
    if (this.canMove) {
      switch (e.code) {
        case "KeyA":
        case "ArrowLeft":
          this.makeMove(LEFT);
          break;
        case "KeyD":
        case "ArrowRight":
          this.makeMove(RIGHT);
          break;
        case "KeyW":
        case "ArrowUp":
          this.makeMove(UP);
          break;
        case "KeyS":
        case "ArrowDown":
          this.makeMove(DOWN);
          break;
      }
    }
  }

  handleSwipe(e: any) {
    //if (this.canMove) {    
    //  var swipeTime = e.upTime - e.downTime;
    //  var fastEnough = swipeTime < gameOptions.swipeMaxTime;
    //  var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
    //  var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
    //  var longEnough = swipeMagnitude > gameOptions.swipeMinDistance;
    //  if (longEnough && fastEnough) {
    //    Phaser.Geom.Point.SetMagnitude(swipe, 1);
    //    if (swipe.x > gameOptions.swipeMinNormal) {
    //      this.makeMove(RIGHT);
    //    }
    //    if (swipe.x < -gameOptions.swipeMinNormal) {
    //      this.makeMove(LEFT);
    //    }
    //    if (swipe.y > gameOptions.swipeMinNormal) {
    //      this.makeMove(DOWN);
    //    }
    //    if (swipe.y < -gameOptions.swipeMinNormal) {
    //      this.makeMove(UP);
    //    }
    //  }
    //}    
  }


  makeMove(direction: number) {
    //this.movingTiles = 0;
    //var dRow = (direction == LEFT || direction == RIGHT) ? 0 : direction == UP ? -1 : 1;
    //var dCol = (direction == UP || direction == DOWN) ? 0 : direction == LEFT ? -1 : 1;
    //this.canMove = false;
    //var movedSomething = false;
    //var movedTiles = 0;
    //var firstRow = (direction == UP) ? 1 : 0;
    //var lastRow = gameOptions.boardSize.rows - ((direction == DOWN) ? 1 : 0);
    //var firstCol = (direction == LEFT) ? 1 : 0;
    //var lastCol = gameOptions.boardSize.cols - ((direction == RIGHT) ? 1 : 0);
    //for (var i = firstRow; i < lastRow; i++) {
    //  for (var j = firstCol; j < lastCol; j++) {
    //    var curRow = dRow == 1 ? (lastRow - 1) - i : i;
    //    var curCol = dCol == 1 ? (lastCol - 1) - j : j;
    //    var tileValue = this.boardArray[curRow][curCol].tileValue;
    //    if (tileValue != 0) {
    //      var newRow = curRow;
    //      var newCol = curCol;
    //      while (this.isLegalPosition(newRow + dRow, newCol + dCol, tileValue)) {
    //        newRow += dRow;
    //        newCol += dCol;
    //      }
    //      movedTiles++;
    //      if (newRow != curRow || newCol != curCol) {
    //        movedSomething = true;
    //        this.boardArray[curRow][curCol].tileSprite.depth = movedTiles;
    //        var newPos = this.getTilePosition(curRow + dRow, curCol + dCol);
    //        var willUpdate = this.boardArray[newRow][newCol].tileValue == tileValue;
    //        this.boardArray[curRow][curCol].tileSprite.x = newPos.x;
    //        this.boardArray[curRow][curCol].tileSprite.y = newPos.y;
    //        //this.moveTile(this.boardArray[curRow][curCol].tileSprite, newPos, willUpdate);
    //        this.boardArray[curRow][curCol].tileValue = 0;
    //        if (willUpdate) {
    //          this.boardArray[newRow][newCol].tileValue++;
    //          this.boardArray[newRow][newCol].upgraded = true;
    //          this.boardArray[curRow][curCol].tileSprite.setFrame(tileValue);              
    //        }
    //        else {
    //          this.boardArray[newRow][newCol].tileValue = tileValue;
    //        }
    //      }
    //    }
    //  }
    //}

    //if (movedSomething) {
    //  this.refreshBoard();
    //}

    //this.canMove = true;    

    //if (this.movingTiles == 0) {
    //  this.canMove = true;
    //}
  }

  moveTile(tile: Phaser.GameObjects.Sprite, point: Phaser.Geom.Point, update: boolean) {
    this.movingTiles++;
    tile.depth = this.movingTiles;
    var distance = Math.abs(tile.x - point.x) + Math.abs(tile.y - point.y);
    this.tweens.add({
      targets: [tile],
      x: point.x,
      y: point.y,
      duration: gameOptions.tweens * distance / gameOptions.cardHeight,
      callbackScope: this,
      onComplete: this.onComplete(tile, update)
    })
  }

  onComplete(tile: Phaser.GameObjects.Sprite, update: boolean) {
    if (update) {
      this.updateTile(tile);
    }
    else {
      this.endTween(tile);
    }   
  }

  endTween(tile: Phaser.GameObjects.Sprite) {
    this.movingTiles--;
    tile.depth = 0;
    if (this.movingTiles == 0) {
      this.refreshBoard();
    } 
  }

  updateTile(tile: Phaser.GameObjects.Sprite) {
    tile.setFrame(tile.frame.name + 1);
    this.tweens.add({
      targets: [tile],
      scaleX: 1.1,
      scaleY: 1.1,
      duration: gameOptions.tweens,
      yoyo: true,
      repeat: 1,
      callbackScope: this,
      onComplete: this.endTween(tile)
    })
  }


  refreshBoard() {
    //for (var i = 0; i < gameOptions.boardSize.rows; i++) {
    //  for (var j = 0; j < gameOptions.boardSize.cols; j++) {
    //    var spritePosition = this.getTilePosition(i, j);
    //    this.boardArray[i][j].tileSprite.x = spritePosition.x;
    //    this.boardArray[i][j].tileSprite.y = spritePosition.y;
    //    var tileValue = this.boardArray[i][j].tileValue;
    //    if (tileValue > 0) {
    //      this.boardArray[i][j].tileSprite.visible = true;
    //      this.boardArray[i][j].tileSprite.setFrame(tileValue - 1);
    //      this.boardArray[i][j].upgraded = false;
    //    }
    //    else {
    //      this.boardArray[i][j].tileSprite.visible = false;
    //    }
    //  }
    //}

    //this.addTile();
  }

  isLegalPosition(row: number, col: number, value: number): boolean {
    //var rowInside = row >= 0 && row < gameOptions.boardSize.rows;
    //var colInside = col >= 0 && col < gameOptions.boardSize.cols;
    //if (!rowInside || !colInside) {
    //  return false;
    //}
    //var emptySpot = this.boardArray[row][col].tileValue == 0;
    //var sameValue = this.boardArray[row][col].tileValue == value;
    //var alreadyUpgraded = this.boardArray[row][col].upgraded;
    //return emptySpot || (sameValue && !alreadyUpgraded);
    return true;
  }
}
