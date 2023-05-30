import GameScore from "../../BelotEngine/GameScore";
import BaseResponse from "./base-response";

export default class ShowScoreResponse extends BaseResponse {
  score!: GameScore;
  isGameOver!: boolean;
}
