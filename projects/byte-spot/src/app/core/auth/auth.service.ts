import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment.development';
import { SignIn } from './models/sign-in.interface';
import { SignUp } from './models/sign-up.interface';

@Injectable({providedIn: 'root'})
export class AuthService {
    private readonly _http = inject(HttpClient);

    private readonly URL = environment.apiUrl + '/users';

    private readonly isLoggedIn = new BehaviorSubject(false);
    isLoggedIn$ = this.isLoggedIn.asObservable();

    signUp(signUp: SignUp): Observable<object> {
        const url = this.URL + '/sign-up';
        return this._http.post(url, signUp, {withCredentials: true});
    }

    signIn(signIn: SignIn): Observable<object> {
        const url = this.URL + '/sign-in';
        return this._http.post(url, signIn, {withCredentials: true})
            .pipe(tap(() => { this.isLoggedIn.next(true); }));
    }

    logout(): Observable<object> {
        if (!this.isLoggedIn.getValue()) {
            return of();
        }
        const url = this.URL + '/logout';
        return this._http.post(url, null, {withCredentials: true})
            .pipe(tap(() => { this.isLoggedIn.next(false); }));
    }

    refreshToken(): Observable<object> {
        const url = this.URL + '/refresh-token';
        return this._http.post(url, null, {withCredentials: true});
    }
}
