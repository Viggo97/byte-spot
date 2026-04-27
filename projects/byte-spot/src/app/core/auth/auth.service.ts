import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { SignIn } from './models/sign-in.interface';
import { SignUp } from './models/sign-up.interface';
import { UserDto } from './user/user-dto.interface';
import { User } from './user/user.model';

@Injectable({providedIn: 'root'})
export class AuthService {
    private readonly _http = inject(HttpClient);

    private readonly URL = environment.apiUrl + '/users';

    private readonly user = new BehaviorSubject<User | null>(null);
    user$ = this.user.asObservable();

    signUp(signUp: SignUp): Observable<object> {
        const url = this.URL + '/sign-up';
        return this._http.post(url, signUp, {withCredentials: true});
    }

    signIn(signIn: SignIn): Observable<UserDto> {
        const url = this.URL + '/sign-in';
        return this._http.post<UserDto>(url, signIn, {withCredentials: true})
            .pipe(tap((user) => {
                this.user.next(new User(user.id, user.firstName, user.lastName, user.role));
            }));
    }

    logout(): Observable<object> {
        if (!this.user.getValue()) {
            return of(EMPTY);
        }
        const url = this.URL + '/logout';
        return this._http.post(url, null, {withCredentials: true})
            .pipe(tap(() => { this.user.next(null); }));
    }

    refreshToken(): Observable<UserDto | null> {
        const url = this.URL + '/refresh-token';
        return this._http.post<UserDto>(url, null, {withCredentials: true})
            .pipe(
                tap((user) => {
                    if (!this.user.getValue()) {
                        this.user.next(new User(user.id, user.firstName, user.lastName, user.role));
                    }
                }),
                catchError(() => {
                    this.user.next(null);
                    return of(null);
                }),
            );
    }
}
