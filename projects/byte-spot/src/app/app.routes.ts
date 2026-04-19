import { Routes } from '@angular/router';
import { ErrorPageComponent } from '@app/core/pages/error-page/error-page.component';
import { OffersOverviewComponent } from '@app/features/offers/overview/offers-overview.component';
import { OffersDetailsComponent } from '@app/features/offers/details/offers-details/offers-details.component';
import { SignUpComponent } from '@app/core/auth/sign-up/sign-up.component';
import { SignInComponent } from '@app/core/auth/sign-in/sign-in.component';

export const routes: Routes = [
    {
        path: 'offers',
        component: OffersOverviewComponent,
    },
    {
        path: 'offers/:id',
        component: OffersDetailsComponent,
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
