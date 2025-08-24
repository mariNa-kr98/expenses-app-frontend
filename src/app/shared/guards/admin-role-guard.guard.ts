import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import { UserService } from '../services/user.service';

export const adminRoleGuardGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const userRoles = userService.user$()?.roles;
  const hasPermission = userRoles?.includes("ADMIN");
  console.log("ADMIN ROLE GUARD", userRoles, hasPermission);

  if (userService.user$() && hasPermission){
    return true;
  }
  
  //TO-DO category insert 
  return router.navigate(['']);
};
