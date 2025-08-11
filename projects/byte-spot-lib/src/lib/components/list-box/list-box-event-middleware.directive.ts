import { Directive, inject, DestroyRef, AfterContentInit, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ListBoxComponent } from './list-box.component';
import { ListBoxEventBusUtil } from './list-box-event-bus.util';

@Directive({selector: '[ngxBsaListBoxEventMiddleware]', standalone: true})
export class ListBoxEventMiddlewareDirective implements AfterContentInit, OnDestroy {

    private host = inject(ListBoxComponent);
    private listBoxEventBus = inject(ListBoxEventBusUtil);
    private destroyRef = inject(DestroyRef);

    ngAfterContentInit(): void {
        this.listBoxEventBus.events()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(event => {
                this.onEvent(event);
            });
    }

    private onEvent(event: KeyboardEvent) {
        this.host.onKeydown(event);
    }

    ngOnDestroy(): void {
        this.listBoxEventBus.reset();
    }
}
