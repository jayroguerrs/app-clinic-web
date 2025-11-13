import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../interfaces/usuario";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  headers: HttpHeaders;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
    });
  }

  login( user: User ): void{
    this.setUser(user);
    window.location.reload();
    this.router.navigate(['/Inicio']);
    window.location.href = "/Inicio";
  }

  logout(): void{
    this.clear();
    window.location.reload();
    this.router.navigate(['/account/login']);
    window.location.href = "/account/login";
  }

  setUser( user: User ): void{
    localStorage.setItem('_u', JSON.stringify(user));
  }
  getUser(): User | null{
    if( localStorage.getItem('_u') ){
      return JSON.parse( localStorage.getItem('_u') );
    }
    return null;
  }

  clear(): void{
    localStorage.clear();
  }

}
