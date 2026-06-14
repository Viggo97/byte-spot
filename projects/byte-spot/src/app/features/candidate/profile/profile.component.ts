import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '@core';
import { UserDataComponent } from './user-data/user-data.component';
import { ChangePasswordComponent } from '../../shared/change-password/change-password.component';

@Component({
    selector: 'bsa-candidate-profile',
    imports: [
        UserDataComponent,
        ChangePasswordComponent,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent {
    private readonly _userService = inject(UserService);

    protected user = toSignal(this._userService.user$);
    protected userAvatar = computed(() => {
        const firstNameLetter = this.user()?.firstName.charAt(0) || '';
        const lastNameLetter = this.user()?.lastName.charAt(0) || '';
        return firstNameLetter + lastNameLetter;
    },
    );
}
