import { Injectable } from "@angular/core";
import { belotServerAPI } from "../../../main";
import * as axios from 'axios';
import BaseRequest from "../requests/base-request";
import BaseResponse from "../responses/base-response";
import { defer, Observable, throwError } from "rxjs";
import { Serialize } from "cerialize";

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

  post<TRequest extends BaseRequest, TResponse extends BaseResponse>(request: TRequest): Observable<axios.AxiosResponse<TResponse>> {
    return defer(() => this.axios.post(belotServerAPI.mainAPI + request.requestUrl, JSON.stringify(Serialize(request)), {
      headers: {
        'Content-Type': 'application/json',
      }
    }));
  }

  get<TRequest extends BaseRequest, TResponse extends BaseResponse>(request: TRequest): Observable<axios.AxiosResponse<TResponse>> {
    return defer(() => this.axios.get(belotServerAPI.mainAPI + request.requestUrl));
  }

  put<TRequest extends BaseRequest, TResponse extends BaseResponse>(request: TRequest): TResponse | void {

  }

  handleError(error: any) {
    console.error(error);

    return throwError(error);
  }
}
