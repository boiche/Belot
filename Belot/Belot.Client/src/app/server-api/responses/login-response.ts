import { autoserializeAs } from "cerialize";
import BaseResponse from "./base-response";

export default class LoginResponse extends BaseResponse {
  @autoserializeAs(Boolean)
  wrongCredentials!: boolean;

  @autoserializeAs(Date)
  banDate!: Date;

  @autoserializeAs(String)
  banReason!: string;

  @autoserializeAs(String)
  id!: string;

  @autoserializeAs(String)
  username!: string;

  @autoserializeAs(String)
  authToken!: string;
}
