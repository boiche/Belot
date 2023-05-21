import { TypeDecorator } from "@angular/core";
import { appConstants } from "../contstants";

export function Authenticated(): TypeDecorator {
  return function (target: any) {
    Object.defineProperty(target, appConstants.requiresAuth, {
      value: true,
      writable: false
    })
  }
}
