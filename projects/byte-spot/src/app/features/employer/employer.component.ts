import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmployerDataService } from './employer-data.service';

@Component({
    selector: 'bsa-employer',
    imports: [
        RouterOutlet,
    ],
    templateUrl: './employer.component.html',
    styleUrl: './employer.component.scss',
    providers: [EmployerDataService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EmployerComponent {}
