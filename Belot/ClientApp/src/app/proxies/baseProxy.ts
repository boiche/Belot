import { Injectable } from "@angular/core";
import { belotServerAPI } from "../../main";
import * as axios from 'axios';
import BaseRequest from "../server-api/requests/base-request";
import BaseResponse from "../server-api/responses/base-response";
import { defer, from, Observable, ObservableInput, ObservedValueOf } from "rxjs";

@Injectable()
export default abstract class BaseProxy {
  private _axios!: axios.AxiosInstance;

  protected get axios() {
    if (this._axios === undefined) {
      this._axios = axios.default.create();
    }
    return this._axios;
  }

  constructor() {
    
  }

  post<TRequest extends BaseRequest, TResponse extends BaseResponse>(request: TRequest): TResponse | void {

  }

  get<TRequest extends BaseRequest, TResponse extends BaseResponse>(request: TRequest): Observable<axios.AxiosResponse<TResponse>> {
    //return from<TResponse>(this.axios.get(belotServerAPI.mainAPI + request.requestUrl, { params: request }));
    return defer(() => this.axios.get(belotServerAPI.mainAPI + request.requestUrl, { params: request }));
  }

  put<TRequest extends BaseRequest, TResponse extends BaseResponse>(request: TRequest): TResponse | void {

  }
}
