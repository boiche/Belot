import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import GetAvailableGamesRequest from "../requests/get-available-games-request";
import GetAvailableGamesResponse from "../responses/get-available-games-response";
import BaseProxy from "./baseProxy";
import * as axios from 'axios'
import RegisterRequest from "../requests/register-request";
import RegisterResponse from "../responses/register-response";
import LoginRequest from "../requests/login-request";
import LoginResponse from "../responses/login-response";
import LogoutRequest from "../requests/logout-request";
import LogoutResponse from '../responses/logout-response';

Injectable({
  providedIn: 'root'
})
class BelotProxy extends BaseProxy {
  getAvailableGames(request: GetAvailableGamesRequest): Observable<axios.AxiosResponse<GetAvailableGamesResponse>> {    
    return this.get<GetAvailableGamesRequest, GetAvailableGamesResponse>(request);
  }

  register(request: RegisterRequest): Observable<axios.AxiosResponse<RegisterResponse>> {
    return this.post<RegisterRequest, RegisterResponse>(request);
  }

  login(request: LoginRequest): Observable<axios.AxiosResponse<LoginResponse>> {
    return this.post<LoginRequest, LoginResponse>(request);
  }

  logout(request: LogoutRequest): Observable<axios.AxiosResponse<LogoutResponse>> {
    return this.post<LogoutRequest, LogoutResponse>(request);
  }
}

export default BelotProxy
