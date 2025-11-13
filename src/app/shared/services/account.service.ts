import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    private headers: HttpHeaders;
    public userYPrivilegio: number = 1;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('usersKey')));
        this.user = this.userSubject.asObservable();
        this.headers = new HttpHeaders({
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT',
          'Access-Control-Allow-Origin':'*'
        });
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(usuario) {
        return this.http.post<any>(`${environment.apiUrl}/api/usuario/login`, usuario,{headers: this.headers});
        // return this.http.post<any>("https://jsonplaceholder.typicode.com/posts" , usuario,{headers: this.headers});
    }

    logout() {
        localStorage.removeItem('usersKey');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(usuario: User) {
        return this.http.post(`${environment.apiUrl}/users/register`, usuario, {headers: this.headers});
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`, {headers: this.headers});
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`, {headers: this.headers});
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params, {headers: this.headers})
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('usersKey', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`, {headers: this.headers})
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }


}
