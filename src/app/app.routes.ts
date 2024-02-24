import { Routes } from '@angular/router';
import { OffersComponent } from '@app/features/pages/offers/offers.component';

export const routes: Routes = [
    {
        path: 'offers',
        component: OffersComponent,
    },
    {
        path: '',
        redirectTo: '/offers',
        pathMatch: 'full',
    },
];
