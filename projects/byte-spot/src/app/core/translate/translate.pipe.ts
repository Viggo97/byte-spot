import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate.service';

@Pipe({
    name: 'translate',
    standalone: true,
})
export class TranslatePipe implements PipeTransform {
    private translateService = inject(TranslateService);

    transform(key: string): string {
        return this.translateService.translate(key);
    }
}
