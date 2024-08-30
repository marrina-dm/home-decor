import { CanActivateFn } from '@angular/router';
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";
import {Location} from "@angular/common";

export const authForwardGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).getIsLoggedIn()) {
    inject(Location).back();
    return false;
  }
  return true;
};
