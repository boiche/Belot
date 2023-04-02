import { HandAnnouncementType } from "../../../BelotEngine/Announcement";
import BaseSignalRRequest from "./base-signalr-request";

export default class HandAnnouncementRequest extends BaseSignalRRequest {
  announcement!: HandAnnouncementType;
  highestRank!: number;
}
