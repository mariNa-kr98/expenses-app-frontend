import { CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const user = userService.user$();
  const hasAdminRole = user?.roles?.includes('ROLE_ADMIN');

  // if (user && user.roles?.includes('ROLE_ADMIN')) {
  //   return true;
  // }else if (user){
  //   snackBar.open('Only admins can access this page', 'Close', { duration: 3000 });
  //   router.navigate(['/app-welcome']);
  //   return false;
  // } else {
  //   snackBar.open('You must log in or register first', 'Close', { duration: 3000 });
  //   router.navigate(['/app-user-login']);
  //   return false;
  // }

  if (userService.user$() && !userService.isTokenExpired()){
    return true;
  } else {
    
    snackBar.open('You must log in or register first', 'Close', {
      duration: 3000,
    });
    
  router.navigate(['app-user-login']);
  return false;
  }
}


