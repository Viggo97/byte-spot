import { inject, SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { firstValueFrom, tap } from 'rxjs';

export function loadSvgSprite() {
    const http = inject(HttpClient);
    const domSanitizer = inject(DomSanitizer);

    return firstValueFrom(
        http.get('assets/svg-sprite.svg', { responseType: 'text' })
            .pipe(
                tap(sprite => {
                    const div = document.createElement('div');
                    div.id = 'svg-sprite';
                    div.style.display = 'none';
                    div.style.visibility = 'hidden';
                    const trustedSvg = domSanitizer.sanitize(SecurityContext.HTML, sprite);
                    if (!trustedSvg) {
                        return;
                    }
                    div.innerHTML = trustedSvg;
                    document.body.append(div);
                }),
            ),
    );
}
