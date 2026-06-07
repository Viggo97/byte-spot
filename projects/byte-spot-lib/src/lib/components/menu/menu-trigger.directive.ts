import { computed, DestroyRef, Directive, ElementRef, inject, input, OnInit, signal, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MenuComponent } from './menu.component';

@Directive({
    selector: '[bslMenuTrigger]',
    host: {
        'type': 'button',
        '[attr.id]': 'id()',
        '[attr.aria-haspopup]': '"true"',
        '[attr.aria-expanded]': 'isOpen()',
        '[attr.aria-controls]': 'menuId()',
        '[class.bsl-menu-button-open-state]': 'isOpen()',
        '(click)': 'toggleMenu()',
    },
})
export class MenuTriggerDirective implements OnInit {
    private _destroyRef = inject(DestroyRef);
    private _viewContainerRef = inject(ViewContainerRef);
    private _elementRef = inject(ElementRef<HTMLButtonElement>);
    private _overlay = inject(Overlay);

    id = input.required<string>();
    menu = input.required<MenuComponent>({alias: 'bslMenuTrigger'});
    protected menuId = computed(() => this.id() + '-menu');

    protected isOpen = signal(false);

    private _overlayRef: null | OverlayRef = null;

    ngOnInit(): void {
        this.menu().eventTriggered$
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(event => {
                if (event instanceof KeyboardEvent && (event.key === 'Escape' || event.key === 'Tab')
                    || (event instanceof MouseEvent)) {
                    (this._elementRef as ElementRef<HTMLButtonElement>).nativeElement.focus();
                }
                this.closeMenu();
            });
    }

    protected toggleMenu(): void {
        if (this.isOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    private openMenu(): void {
        if (this.isOpen()) return;

        const positionStrategy = this._overlay
            .position()
            .flexibleConnectedTo(this._elementRef)
            .withPositions([
                { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
                { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top'},
            ]);

        this._overlayRef = this._overlay.create({
            positionStrategy,
            scrollStrategy: this._overlay.scrollStrategies.reposition(),
            hasBackdrop: true,
        });

        this._overlayRef
            .backdropClick()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => { this.closeMenu(); });

        const portal = new TemplatePortal(
            this.menu().templateRef(),
            this._viewContainerRef,
            {
                id: this.menuId(),
                ariaLabelledBy: this.id(),
            });

        this._overlayRef.attach(portal);

        this.isOpen.set(true);
        this.menu().focusItem(0);
    }

    protected closeMenu(): void {
        if (!this.isOpen()) return;

        this._overlayRef?.detach();
        this._overlayRef?.dispose();
        this._overlayRef = null;
        this.isOpen.set(false);
    }
}
