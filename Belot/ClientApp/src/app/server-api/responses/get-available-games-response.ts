import BelotGame from "../../BelotEngine/BelotGame";
import BaseResponse from "./base-response";

export default class GetAvailableGamesResponse extends BaseResponse {
  games!: BelotGame[]
}
