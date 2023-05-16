import { autoserializeAs } from "cerialize";
import BaseResponse from "./base-response";

export default class RegisterResponse extends BaseResponse {
  @autoserializeAs(Boolean)
  status!: boolean;
}
