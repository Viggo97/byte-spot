import { FormControl } from '@angular/forms';

export type ValueControl<T> = {
    value: T;
    control: FormControl;
};
