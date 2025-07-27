import { FormControl } from '@angular/forms';

export interface KeyValueControl<T, U> {
    key: T;
    value: U;
    control: FormControl;
}
