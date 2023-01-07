import Card from "../../../GameObjects/Card";
import BaseSignalRRequest from "./base-signalr-request";

export default class ShowOpponentCardRequest extends BaseSignalRRequest {
  public card!: Card;
  public opponentConnectionId!: string | null;
}
