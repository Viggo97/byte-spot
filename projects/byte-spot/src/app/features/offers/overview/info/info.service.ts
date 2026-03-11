import { Injectable, signal } from '@angular/core';

@Injectable()
export class InfoService {
    total = signal(0);
}
