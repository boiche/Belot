import BaseSignalRRequest from "./base-signalr-request";

export default class CreateGameRequest extends BaseSignalRRequest {
  username!: string;
}
