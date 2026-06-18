import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { catchError, EMPTY, map, Observable, of, ReplaySubject, switchMap, tap } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { SignIn } from './models/sign-in.interface';
import { SignUp } from './models/sign-up.interface';
import { SignUpCompany } from './models/sign-up-company.interface';
import { UserDto } from './user/user-dto.interface';
import { User } from './user/user.model';
import { UserService } from './user/user.service';
import { BYPASS_ERROR_INTERCEPTOR } from '../errors/bypass-error-interceptor.const';

@Injectable({providedIn: 'root'})
export class AuthService {
    private readonly _http = inject(HttpClient);
    private readonly _userService = inject(UserService);

    private readonly URL = environment.apiUrl + '/users';

    private readonly initialized = new ReplaySubject<boolean>(1);
    initialized$ = this.initialized.asObservable();

    private _isAuthenticated = false;
    get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    signUp(signUp: SignUp): Observable<object> {
        const url = this.URL + '/sign-up';
        return this._http.post(url, signUp);
    }

    signUpCompany(signUpCompany: SignUpCompany): Observable<object> {
        const url = environment.apiUrl + '/companies';
        return this._http.post(url, signUpCompany);
    }

    signIn(signIn: SignIn): Observable<UserDto> {
        const url = this.URL + '/sign-in';
        return this._http.post<UserDto>(url, signIn)
            .pipe(tap((user) => {
                this._isAuthenticated = true;
                this._userService.setUser(User.fromDto(user));
            }));
    }

    logout(): Observable<object> {
        this._isAuthenticated = false;

        if (!this._userService.getUser()) {
            return of(EMPTY);
        }

        this._userService.clearUser();

        const url = this.URL + '/logout';
        return this._http.post(url, null);
    }

    refreshToken(): Observable<UserDto | null> {
        const url = this.URL + '/refresh-token';
        return this._http.post<UserDto>(url, null, {context: new HttpContext().set(BYPASS_ERROR_INTERCEPTOR, true)})
            .pipe(
                tap((user) => {
                    this._isAuthenticated = true;
                    this.initialized.next(true);
                    if (!this._userService.getUser()) {
                        this._userService.setUser(User.fromDto(user));
                    }
                }),
                catchError(() => {
                    this.initialized.next(true);
                    this._userService.clearUser();
                    return of(null)
                        .pipe(
                            switchMap(() => this.logout()),
                            map(() => null),
                        );
                }),
            );
    }

    validateEmail(email: string): Observable<boolean> {
        const url = this.URL + '/validate-email';
        const params = new HttpParams().set('email', email);
        return this._http.get<boolean>(url, {params});
    }
}
