import { Routes } from '@angular/router';
import { EmployerComponent } from './employer.component';
import { EmployerOffersComponent } from './offers/offers.component';
import { EmployerApplicationsComponent } from './applications/applications.component';

export const routes: Routes = [{
    path: '',
    component: EmployerComponent,
    children: [
        {
            path: '',
            redirectTo: 'offers',
            pathMatch: 'full',
        },
        {
            path: 'offers',
            component: EmployerOffersComponent,
        },
        {
            path: 'applications/:offerId',
            component: EmployerApplicationsComponent,
        },
    ],
}];
