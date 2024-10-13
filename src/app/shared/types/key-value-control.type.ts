import { FormControl } from '@angular/forms';

export type KeyValueControl<T, U> = {
    key: T;
    value: U;
    control: FormControl;
};
