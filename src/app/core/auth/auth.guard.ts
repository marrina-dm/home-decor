import {CanActivateFn} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthService).getIsLoggedIn();
  if (!isLoggedIn) {
    inject(MatSnackBar).open('Для доступа необходимо авторизоваться');
  }

  return isLoggedIn;
};
