import { Injectable } from "@angular/core";
import { belotServerAPI } from "../../../main";
import * as axios from 'axios';
import BaseRequest from "../requests/base-request";
import BaseResponse from "../responses/base-response";
import { defer, Observable, throwError } from "rxjs";
import { Serialize } from "cerialize";
import CookieManager from "../../shared/cookie-manager";

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
    this._axios = axios.default.create();
    this._axios.defaults.headers.common["Content-type"] = "application/json";
  }

  post<TRequest extends BaseRequest, TResponse extends BaseResponse>(request: TRequest, headers: axios.RawAxiosRequestHeaders | undefined = undefined): Observable<axios.AxiosResponse<TResponse>> {
    var response = this.axios.post(belotServerAPI.mainAPI + request.requestUrl, JSON.stringify(Serialize(request)), {
      headers: headers
    });
    response.catch((error) => this.handleError(error));

    return defer(() => response);
  }

  get<TRequest extends BaseRequest, TResponse extends BaseResponse>(request: TRequest): Observable<axios.AxiosResponse<TResponse>> {
    var response = this.axios.get(belotServerAPI.mainAPI + request.requestUrl);
    response.catch((error) => this.handleError(error));

    return defer(() => response);
  }

  put<TRequest extends BaseRequest, TResponse extends BaseResponse>(request: TRequest): TResponse | void {

  }

  handleError(error: any) {
    console.error(error);
  }
}
