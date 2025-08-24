import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminRoleGuardGuard } from './admin-role-guard.guard';

describe('adminRoleGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminRoleGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
