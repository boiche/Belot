import { Injectable } from "@angular/core";
import * as signalR from '@microsoft/signalr';
import { belotServerAPI } from '../../main';
import BaseRequest from "../server-api/requests/base-request";
import ISignalRProxy from "./interfaces/ISignalRProxy";

@Injectable({
  providedIn: 'root'
})
class SignalRProxy implements ISignalRProxy {
  connection!: signalR.HubConnection;

  createConnection(): ISignalRProxy {
    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl(belotServerAPI.signalR)      
      .build();

    this.connection.serverTimeoutInMilliseconds = 999999;    

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
      this.createConnection();
    }
  }
}

export default SignalRProxy
