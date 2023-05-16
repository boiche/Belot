import { autoserializeAs } from "cerialize";
import BaseResponse from "./base-response";

export default class LoginResponse extends BaseResponse {
  @autoserializeAs(Boolean)
  status!: string;
}
