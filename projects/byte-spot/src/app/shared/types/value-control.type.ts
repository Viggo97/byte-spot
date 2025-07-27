import { FormControl } from '@angular/forms';

export interface ValueControl<T> {
    value: T;
    control: FormControl;
}
