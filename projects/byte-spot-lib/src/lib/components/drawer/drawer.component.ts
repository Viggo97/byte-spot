import { AfterViewInit, Component, HostBinding, HostListener, input, output } from '@angular/core';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { IconXmarkComponent } from '../icons/icon-x-mark.component';

@Component({
    selector: 'ngx-bsa-drawer',
    imports: [
        CdkTrapFocus,
        IconXmarkComponent,
    ],
    templateUrl: './drawer.component.html',
    styleUrl: './drawer.component.scss',
    animations: [
        trigger('animation', [
            state('open', style({ transform: 'translateY(0)' })),
            state('closed', style({ transform: 'translateY(100%)' })),
            transition('open <=> closed', animate('150ms cubic-bezier(0, 0, 0.2 , 1)')),
        ]),
    ],
    host: {
        'role': 'dialog',
        'aria-modal': 'true',
        '[attr.aria-label]': 'title()',
    },
})
export class DrawerComponent implements AfterViewInit {
    title = input.required<string>();
    closeDrawer = output();

    @HostBinding('@animation') animationState = 'closed';

    @HostListener('@animation.done', ['$event']) done(event: AnimationEvent): void {
        if (event.toState === 'closed') {
            this.closeDrawer.emit();
        }
    }

    ngAfterViewInit(): void {
        this.animationState = 'open';
    }

    close(): void {
        this.animationState = 'closed';
    }
}
