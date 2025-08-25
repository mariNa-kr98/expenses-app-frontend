import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');
    console.log('[AuthInterceptor] Token found:', token ? 'YES' : 'NO');
    console.log('[AuthInterceptor] Request URL:', request.url);

    if (token) {
      const cloned = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('[AuthInterceptor] Added Authorization header');
      return next.handle(cloned);
    }else {
      console.log('[AuthInterceptor] No token, sending request without Authorization');
    }

    return next.handle(request);
  }
}
