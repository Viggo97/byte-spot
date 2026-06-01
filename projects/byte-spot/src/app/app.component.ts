import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService, NavbarComponent, TranslatePipe } from '@core';
import { LoaderComponent } from '@shared';

@Component({
    selector: 'bsa-root',
    imports: [RouterOutlet, NavbarComponent, LoaderComponent, TranslatePipe],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    title = 'byte-spot';

    private readonly authService = inject(AuthService);

    protected loading = signal(true);

    ngOnInit(): void {
        this.authService.refreshToken().subscribe(() => {
            this.loading.set(false);
        });
    }
}
