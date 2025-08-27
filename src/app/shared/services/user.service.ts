import { Injectable, inject, signal, effect } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {User, LoggedInUser} from '../models/user.modelmodel';
import { tap } from 'rxjs/operators';
import {DecodedTokenRaw} from '../models/user.modelmodel';


const API_URL = `${environment.apiURL}/api/users`;
const API_URL_AUTH = `${environment.apiURL}/api/auth`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  http: HttpClient = inject(HttpClient);
  router = inject(Router);

  user$ = signal<LoggedInUser | null>(null);
  setUser(user: LoggedInUser) {
    this.user$.set(user);
  }


  constructor() {
    const token = this.getToken();
    if (token) {
    const decoded = this.decodeJwtToken(token) as DecodedTokenRaw;
    if (decoded) {
      const normalizedUser: LoggedInUser = {
        sub: decoded.sub,
        roles: decoded.role
          ? (Array.isArray(decoded.role) 
            ? decoded.role
            : [decoded.role])
          : []
      };
      this.user$.set(normalizedUser);
      console.log('User restored from token:', normalizedUser);
      console.log('Decoded token in UserService:', decoded);
      }
    }

    effect(() => {
      if (this.user$()) {
        console.log('User Logged In', this.user$()?.sub);
      } else {
        console.log("No user Logged in");
      }
    });
  }

  registerUser(user:User) {
    return this.http.post<{status: boolean, data: User}>(
      `${API_URL}/save`, user
    )
  }

  loginUser(user: User) {

    return this.http.post<{username: string; token: string }>(
      `${API_URL_AUTH}/login`, user
    ).pipe(
      tap(response => {
        const token = response.token;
        this.setToken(token);
        const decoded = this.decodeJwtToken(token) as DecodedTokenRaw;
        if(decoded) {
          const normalizedUser: LoggedInUser = {
            sub: decoded.sub,
            roles: decoded.role
              ? (Array.isArray(decoded.role) 
                ? decoded.role
                : [decoded.role])
              : []
          };
          this.user$.set(normalizedUser);
          console.log('User set in UserService:', normalizedUser);
          console.log('Decoded token in UserService:', decoded);

        }
      })
    );
  }

  logoutUser(){
    this.user$.set(null);
    this.clearToken();
    this.router.navigate(['app-user-login']);
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

   decodeJwtToken(token: string): DecodedTokenRaw | null {
    if (!token) return null;
    
    try {
      return jwtDecode(token) as DecodedTokenRaw;
    } catch {
      return null;
    }
  }

  deleteUser(id: number) {
    return this.http.delete(`${API_URL}/delete/${id}`);
  }

  getAllUsers() {
    return this.http.get<User[]>(`${API_URL}/getAll`);
  }

  registerAdmin(user: User & {role: string}) {
    return this.http.post<User>(`${API_URL}/admins/save`, user);
  }
  
}
  
