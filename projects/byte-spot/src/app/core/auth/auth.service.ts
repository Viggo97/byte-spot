import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { SignIn } from './models/sign-in.interface';
import { SignUp } from './models/sign-up.interface';
import { UserDto } from './user/user-dto.interface';
import { User } from './user/user.model';
import { UserDataDto } from '@app/core/auth/user/user-data-dto.interface';

@Injectable({providedIn: 'root'})
export class AuthService {
    private readonly _http = inject(HttpClient);

    private readonly URL = environment.apiUrl + '/users';

    private readonly user = new BehaviorSubject<User | null>(null);
    user$ = this.user.asObservable();

    signUp(signUp: SignUp): Observable<object> {
        const url = this.URL + '/sign-up';
        return this._http.post(url, signUp);
    }

    signIn(signIn: SignIn): Observable<UserDto> {
        const url = this.URL + '/sign-in';
        return this._http.post<UserDto>(url, signIn)
            .pipe(tap((user) => {
                this.user.next(new User(user.id, user.email, user.firstName, user.lastName, user.role));
            }));
    }

    logout(): Observable<object> {
        if (!this.user.getValue()) {
            return of(EMPTY);
        }
        this.user.next(null);

        const url = this.URL + '/logout';
        return this._http.post(url, null);
    }

    refreshToken(): Observable<UserDto | null> {
        const url = this.URL + '/refresh-token';
        return this._http.post<UserDto>(url, null)
            .pipe(
                tap((user) => {
                    if (!this.user.getValue()) {
                        this.user.next(new User(user.id, user.email, user.firstName, user.lastName, user.role));
                    }
                }),
                catchError(() => {
                    this.user.next(null);
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

    changeUserData(userData: UserDataDto): Observable<object> {
        const url = this.URL + '/change-data';
        return this._http.post(url, userData);
    }
}
