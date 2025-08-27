import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import { UserService } from '../services/user.service';

export const adminRoleGuardGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const user = userService.user$();
  const userRoles = user?.roles;
  // const roles = user?.roles ?? [];
  const hasPermission = userRoles?.includes("ROLE_ADMIN") ?? false;

  console.log("ADMIN ROLE GUARD", userRoles, hasPermission);

  if (user && hasPermission){
    return true;
  }
  
  return router.navigate(['/app-user-login']);
};

