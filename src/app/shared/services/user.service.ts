import { Injectable, inject, signal, effect } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {User, LoggedInUser} from '../models/user.modelmodel';
import { tap } from 'rxjs/operators';


const API_URL = `${environment.apiURL}/api/users`;
const API_URL_AUTH = `${environment.apiURL}/api/auth`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  http: HttpClient = inject(HttpClient);
  router = inject(Router);

  user$ = signal<LoggedInUser | null>(null);


  constructor() {
    const token = this.getToken();
    if (token) {
    const decoded = this.decodeJwtToken(token);
    if (decoded) {
      this.user$.set(decoded);
      }
    }

    effect(() => {
      if (this.user$()) {
        console.log('User Logged In', this.user$()?.username);
      } else {
        console.log("No user Logged in");
      }
    });
  }

  registerUser(user:User) {
    return this.http.post<{status: boolean, data: User}>(
      `${API_URL}`, user
    )
  }

  loginUser(user: User) {

    return this.http.post<{username: string; token: string }>(
      `${API_URL_AUTH}/login`, user
    ).pipe(
      tap(response => {
        const token = response.token;
        this.setToken(token);
        const decoded = this.decodeJwtToken(token);
        if(decoded) {
          this.user$.set(decoded);
        }
      })
    );
  }

  logoutUser(){
    this.user$.set(null);
    this.clearToken();
    this.router.navigate(['login']);
  }

  isLoggedIn(): boolean {
    return this.user$() !== null && !this.isTokenExpired();
  }

  hasRole(role: string): boolean {
    return this.user$()?.roles.includes(role) ?? false;
  }
  

  isTokenExpired(): boolean {

    const token = this.getToken();
    if(!token) return true;
    try{
      const decoded: any = jwtDecode(token);
      return decoded.exp < Math.floor(Date.now() / 1000);
    }catch {
      return true;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setToken(token: string) {
    localStorage.setItem('access_token', token);
  }
  
  private clearToken() {
    localStorage.removeItem('access_token');
  }

   decodeJwtToken(token: string): LoggedInUser | null {
    if (!token) return null;
    try {
      return jwtDecode(token) as LoggedInUser;
    } catch {
      return null;
    }
  }
}
  
