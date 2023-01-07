import { Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import { Guid } from "guid-typescript";
import { belotServerAPI } from '../../main';
import Player from "../BelotEngine/Player";
import BaseRequest from "../server-api/requests/base-request";
import BaseSignalRRequest from "../server-api/requests/signalR/base-signalr-request";
import ISignalRProxy from "./interfaces/ISignalRProxy";

@Injectable({
  providedIn: 'root'
})
class SignalRProxy implements ISignalRProxy {
  connection!: signalR.HubConnection;
  _gameId!: string;

  public async getPlayer(): Promise<Player> {
    var request = new BaseSignalRRequest();
    request.gameId = this._gameId;
    return await this.connection.invoke("GetPlayerInfo", this._gameId);
  }

  createConnection(gameId: string): ISignalRProxy {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(belotServerAPI.signalR)      
      .build();

    this.connection.serverTimeoutInMilliseconds = 999999;    

    this._gameId = gameId;

    return this;
  }

  startConnection(): Promise<void> {
    this.checkConnection();
    return this.connection.start();
  }

  invoke(method: string, request: BaseRequest | null = null): Promise<any> {
    if (request === null)
      return this.connection.invoke(method);
    else 
      return this.connection.invoke(method, request);
  }

  on(method: string, callback: (...args: any[]) => void): void {
    this.connection.on(method, callback);
  }

  private checkConnection() {
    if (!this.connection) {
      this.createConnection(this._gameId);
    }
  }

  getConnectionId(): string | null {
    return this.connection.connectionId;
  }
}

export default SignalRProxy
