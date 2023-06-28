import BelotGame from "../../BelotEngine/BelotGame";
import BaseResponse from "./base-response";

export default class GetGameResponse extends BaseResponse {
  game!: BelotGame
}
