import { Routes } from '@angular/router';
import { ErrorPageComponent } from '@app/core/pages/error-page/error-page.component';
import { OffersOverviewComponent } from '@app/features/offers/overview/offers-overview.component';
import { OffersDetailsComponent } from '@app/features/offers/details/offers-details/offers-details.component';

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
        path: 'error',
        component: ErrorPageComponent,
    },
    {
        path: '',
        redirectTo: '/offers',
        pathMatch: 'full',
    },
];
