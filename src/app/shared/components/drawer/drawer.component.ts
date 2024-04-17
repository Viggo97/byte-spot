import {
    animate, style, transition, trigger,
} from '@angular/animations';
import { NgComponentOutlet } from '@angular/common';
import {
    Component, EventEmitter, Input, Type,
} from '@angular/core';
import { ComponentInputs } from '@app/core/models/overlay/component-inputs.model';

@Component({
    selector: 'bsa-drawer',
    standalone: true,
    imports: [
        NgComponentOutlet,
    ],
    templateUrl: './drawer.component.html',
    styleUrl: './drawer.component.scss',
    animations: [
        trigger('drawerTrigger', [
            transition(':enter', [
                style({ transform: 'translateY(100%)' }),
                animate('150ms', style({ transform: 'translateY(0)' })),
            ]),
            transition(':leave', [
                animate('150ms', style({ transform: 'translateY(100%)' })),
            ]),
        ]),
    ],
})
export class DrawerComponent<T> {
    @Input({ required: true }) component!: Type<T>;
    @Input() set inputs(inputs: ComponentInputs[]) {
        inputs.forEach((input) => {
            this.componentInputs[input.name] = input.value;
        });
    }

    get inputs(): Record<string, any> {
        return this.componentInputs;
    }

    private componentInputs: Record<string, any> = {};

    closeDrawer = new EventEmitter<void>();

    onCloseDrawer(): void {
        this.closeDrawer.emit();
    }
}
