import { Observable, ReplaySubject } from 'rxjs';

export class ListBoxEventBusUtil {
    private source = new ReplaySubject<KeyboardEvent>(1);

    emit(event: KeyboardEvent): void {
        this.source.next(event);
    }

    events(): Observable<KeyboardEvent> {
        return this.source.asObservable();
    }

    reset(): void {
        this.source.complete();
        this.source = new ReplaySubject(1);
    }
}
