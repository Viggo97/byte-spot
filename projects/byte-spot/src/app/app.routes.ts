import { Routes } from '@angular/router';
import { authGuard, ErrorPageComponent, loggedInGuard, roleGuard } from '@core';
import { SignUpComponent } from '@app/core/auth/sign-up/sign-up.component';
import { SignInComponent } from '@app/core/auth/sign-in/sign-in.component';
import { Role } from '@app/core/auth/user/role.enum';

export const routes: Routes = [
    {
        path: 'offers',
        loadComponent: () => import('./features/offers/overview/offers-overview.component')
            .then(m => m.OffersOverviewComponent),
    },
    {
        path: 'offers/create',
        canActivate: [authGuard, roleGuard],
        loadComponent: () => import('./features/offers/create/create.component')
            .then(m => m.OffersCreateComponent),
        data: {roles: [Role.Employer]},
    },
    {
        path: 'offers/:id',
        loadComponent: () => import('./features/offers/details/offers-details/offers-details.component')
            .then(m => m.OffersDetailsComponent),
    },
    {
        path: 'offers/:id/apply',
        loadComponent: () => import('./features/application/apply/apply.component')
            .then(m => m.ApplicationApplyComponent),
    },
    {
        path: 'candidate',
        canActivate: [authGuard],
        loadChildren: () => import('./features/candidate/candidate.routes')
            .then(m => m.routes),
    },
    {
        path: 'sign-up',
        canActivate: [loggedInGuard],
        component: SignUpComponent,
    },
    {
        path: 'sign-in',
        canActivate: [loggedInGuard],
        component: SignInComponent,
    },
    {
        path: 'error',
        component: ErrorPageComponent,
    },
    {
        path: '',
        redirectTo: '/offers',
        pathMatch: 'full',
    },
];
