import { Component, input } from '@angular/core';

@Component({
    selector: 'bsa-loader',
    imports: [],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss',
})
export class LoaderComponent {
    width = input<string>();
}
