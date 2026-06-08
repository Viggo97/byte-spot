import { Routes } from '@angular/router';
import { authGuard } from '@core';
import { ErrorPageComponent } from '@app/core/pages/error-page/error-page.component';
import { SignUpComponent } from '@app/core/auth/sign-up/sign-up.component';
import { SignInComponent } from '@app/core/auth/sign-in/sign-in.component';

export const routes: Routes = [
    {
        path: 'offers',
        loadComponent: () => import('./features/offers/overview/offers-overview.component')
            .then(m => m.OffersOverviewComponent),
    },
    {
        path: 'offers/:id',
        loadComponent: () => import('./features/offers/details/offers-details/offers-details.component')
            .then(m => m.OffersDetailsComponent),
    },
    {
        path: 'candidate',
        canActivate: [authGuard],
        loadChildren: () => import('./features/candidate/candidate.routes')
            .then(m => m.routes),
    },
    {
        path: 'sign-up',
        component: SignUpComponent,
    },
    {
        path: 'sign-in',
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
