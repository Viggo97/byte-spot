import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, tap } from 'rxjs';

export function loadSvgSprite() {
    const http = inject(HttpClient);

    return firstValueFrom(
        http.get('assets/svg-sprite.svg', { responseType: 'text' })
            .pipe(
                tap(sprite => {
                    const div = document.createElement('div');
                    div.id = 'svg-sprite';
                    div.style.display = 'none';
                    div.style.visibility = 'hidden';
                    div.innerHTML = sprite;
                    document.body.append(div);
                }),
            ),
    );
}
