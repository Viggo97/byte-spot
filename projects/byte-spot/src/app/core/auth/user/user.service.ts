import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'projects/byte-spot/src/environments/environment';
import { User } from './user.model';
import { UserUpdateDto } from '@app/core/auth/user/user-update-dto.interface';

@Injectable({providedIn: 'root'})
export class UserService {
    private readonly _http = inject(HttpClient);

    private readonly URL = environment.apiUrl + '/users';

    private readonly user = new BehaviorSubject<User | null>(null);
    user$ = this.user.asObservable();

    setUser(user: User): void {
        this.user.next(user);
    }

    getUser(): User | null {
        return this.user.getValue();
    }

    clearUser(): void {
        this.user.next(null);
    }

    updateUser(userId: string, userData: UserUpdateDto): Observable<object> {
        const url = `${this.URL}/${userId}`;
        return this._http.put(url, userData)
            .pipe(tap(() => {
                const previousUser = this.user.getValue();
                if (!previousUser) { return; }
                const newUser = new User(
                    previousUser.id,
                    previousUser.email,
                    userData.firstName,
                    userData.lastName,
                    previousUser.role,
                );
                this.user.next(newUser);
            }));
    }
}
