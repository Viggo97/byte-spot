import { Routes } from '@angular/router';
import { CandidateComponent } from './candidate.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [{
    path: '',
    component: CandidateComponent,
    children: [
        {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full',
        },
        {
            path: 'profile',
            component: ProfileComponent,
        },
    ],
}];
