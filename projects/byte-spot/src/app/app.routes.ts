import { Routes } from '@angular/router';
import { OffersOverviewComponent } from '@app/features/offers-overview/offers-overview.component';

export const routes: Routes = [
    {
        path: 'offers',
        component: OffersOverviewComponent,
    },
    {
        path: '',
        redirectTo: '/offers',
        pathMatch: 'full',
    },
];
