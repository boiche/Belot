import { autoserializeAs } from "cerialize";
import BaseRequest from "./base-request";

export default class LogoutRequest extends BaseRequest {
  @autoserializeAs(String)
  username!: string;
}
