import {afterNextRender,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    output,
    signal,
    ViewEncapsulation} from '@angular/core';
import {CdkTrapFocus} from '@angular/cdk/a11y';

@Component({
    selector: 'bsl-drawer',
    imports: [
        CdkTrapFocus,
    ],
    templateUrl: './drawer.component.html',
    styleUrl: './drawer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'role': 'dialog',
        'aria-modal': 'true',
        '[attr.aria-label]': 'title()',
        '[class.bsl-drawer-closed]': 'isClosed()',
        '(transitionend)': 'onTransitionEnd($event)',
    },
})
export class DrawerComponent {
    title = input.required<string>();
    closed = output();
    protected isClosed = signal(true);
    private elementRef = inject(ElementRef);

    constructor() {
        afterNextRender(() => {
            this.isClosed.set(false);
        });
    }

    close(): void {
        this.isClosed.set(true);
        this.closed.emit();
    }

    protected onTransitionEnd(event: TransitionEvent) {
        if (this.elementRef.nativeElement === event.target) {
            if (this.isClosed()) {
                this.closed.emit();
            }
        }
    }
}
