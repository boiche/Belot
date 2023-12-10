import BaseSignalRRequest from "./base-signalr-request";

export default class JoinGameRequest extends BaseSignalRRequest {
  gameId!: string;
  username!: string;
}
