import {
    Component, ElementRef, Input, ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EdgeX, EdgeY } from '@app/core/enums/overlay/relative-position-edge.enum';
import { OverlayService } from '@app/core/services/overlay/overlay.service';
import { DropdownContainerComponent } from '@app/shared/components/dropdown-container/dropdown-container.component';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'bsa-select',
    standalone: true,
    imports: [
        FormsModule,
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
})
export class SelectComponent {
    value: string = '10';

    @Input({ required: true }) options!: Map<string, string>;

    @ViewChild('buttonRef') input!: ElementRef<HTMLInputElement>;

    constructor(private overlayService: OverlayService<DropdownContainerComponent>) {
    }

    onSelectSwitch(): void {
        const [dropdownContainerRef, close$] = this.overlayService.show(DropdownContainerComponent, {
            componentInputs: [
                { name: 'options', value: this.options },
            ],
            backdrop: {
                background: false,
            },
            relativePosition: {
                width: this.input.nativeElement.offsetWidth,
                relativeElement: this.input.nativeElement,
                edgePositionX: {
                    relativeEdge: EdgeX.RIGHT,
                    contentEdge: EdgeX.RIGHT,
                },
                edgePositionY: {
                    relativeEdge: EdgeY.BOTTOM,
                    contentEdge: EdgeY.TOP,
                },
            },
        });

        dropdownContainerRef?.instance.selectOption
            .pipe(takeUntil(close$))
            .subscribe((value) => {
                this.value = value.value;
                this.overlayService.close();
            });
    }
}
