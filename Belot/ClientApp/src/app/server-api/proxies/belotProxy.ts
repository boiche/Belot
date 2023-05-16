import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import GetAvailableGamesRequest from "../requests/get-available-games-request";
import GetAvailableGamesResponse from "../responses/get-available-games-response";
import BaseProxy from "./baseProxy";
import * as axios from 'axios'
import RegisterRequest from "../requests/register-request";
import RegisterResponse from "../responses/register-response";
import { catchError, map } from "rxjs/operators";

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
}

export default BelotProxy
