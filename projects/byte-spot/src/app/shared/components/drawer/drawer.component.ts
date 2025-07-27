import { AfterViewInit, Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
    selector: 'bsa-drawer',
    imports: [
        A11yModule,
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
})
export class DrawerComponent implements AfterViewInit {
    @Input() title: string | null = null;

    @Output() closeDrawer = new EventEmitter<void>();

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
