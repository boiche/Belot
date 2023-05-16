import { autoserializeAs } from "cerialize";
import BaseRequest from "./base-request";

export default class RegisterRequest extends BaseRequest {
  @autoserializeAs(String)
  username!: string;

  @autoserializeAs(String)
  email!: string;

  @autoserializeAs(String)
  password!: string;
}
