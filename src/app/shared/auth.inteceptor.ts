import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private router = inject(Router);
  private userService = inject(UserService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');
    console.log('[AuthInterceptor] Token found:', token ? 'YES' : 'NO');
    console.log('[AuthInterceptor] Request URL:', request.url);

    let clonedRequest = request;

    if (token) {
      clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[AuthInterceptor] Added Authorization header');
    }else {
      console.log('[AuthInterceptor] No token, sending request without Authorization');
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
        
          console.warn('[AuthInterceptor] Unauthorized or Forbidden response, logging out user');

          localStorage.removeItem('access_token');
          this.userService.user$.set(null);

          this.router.navigate(['/app-user-login']);
        }
        return throwError(() => error);
      })
    );
  }
}
