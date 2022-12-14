import { GameAnnouncementType } from "../../../BelotEngine/Announcement";
import BaseSignalRRequest from "./base-signalr-request";

export default class GameAnnouncementRequest extends BaseSignalRRequest {
  announcement!: GameAnnouncementType;
}
