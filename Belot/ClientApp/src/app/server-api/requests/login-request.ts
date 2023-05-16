import { autoserializeAs } from "cerialize";
import BaseRequest from "./base-request";

export default class LoginRequest extends BaseRequest {
  @autoserializeAs(String)
  username!: string;

  @autoserializeAs(String)
  password!: string;
}
