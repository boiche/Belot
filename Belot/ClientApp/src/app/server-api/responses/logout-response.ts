import { autoserializeAs } from "cerialize";
import BaseResponse from "./base-response";

export default class LogoutResponse extends BaseResponse {
  @autoserializeAs(Boolean)
  status!: string;
}
