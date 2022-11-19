import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import GetAvailableGamesRequest from "../server-api/requests/get-available-games-request";
import GetAvailableGamesResponse from "../server-api/responses/get-available-games-response";
import BaseProxy from "./baseProxy";
import * as axios from 'axios'

Injectable({
  providedIn: 'root'
})
class BelotProxy extends BaseProxy {
  getAvailableGames(request: GetAvailableGamesRequest): Observable<axios.AxiosResponse<GetAvailableGamesResponse>> {    
    return this.get<GetAvailableGamesRequest, GetAvailableGamesResponse>(request);
  }
}

export default BelotProxy
