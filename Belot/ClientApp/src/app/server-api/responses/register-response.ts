import { autoserializeAs } from "cerialize";
import { User } from "../../shared/types/user";
import BaseResponse from "./base-response";

export default class RegisterResponse extends BaseResponse {
  @autoserializeAs(String)
  token!: boolean;

  user!: User;
}
