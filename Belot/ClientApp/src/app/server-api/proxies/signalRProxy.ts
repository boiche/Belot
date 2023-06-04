import { Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import { belotServerAPI } from '../../../main';
import BaseSignalRRequest from "../requests/signalR/base-signalr-request";
import ISignalRProxy from "./interfaces/ISignalRProxy";

@Injectable({
  providedIn: 'root'
})
class SignalRProxy implements ISignalRProxy {
  connection!: signalR.HubConnection;
  private recentError!: any;
  public get RecentError() {
    return this.clearError();
  }
  _gameId!: string;

  public async getPlayer(): Promise<any> {
    var request = new BaseSignalRRequest();
    request.gameId = this._gameId;
    return await this.connection.invoke("GetPlayerInfo", this._gameId);
  }

  createConnection(gameId: string): ISignalRProxy {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.None)
      .withUrl(belotServerAPI.signalR)      
      .build();

    this.connection.serverTimeoutInMilliseconds = 999999;    

    this.connection.on("Error", (response: any) => {
      alert(response);
      this.recentError = response;      
      //TODO: show error component with 'Go back' button
    })

    this._gameId = gameId;

    return this;
  }

  startConnection(): Promise<void> {
    this.checkConnection();
    return this.connection.start();
  }

  invoke(method: string, request: BaseSignalRRequest | null = null): Promise<any> {
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

  clearError() {
    let temp = this.recentError;
    this.recentError = null;
    return temp;
  }
}

export default SignalRProxy
