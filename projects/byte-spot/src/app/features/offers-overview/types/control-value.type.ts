import { CoreValue } from '@core';

import { FormControl } from '@angular/forms';

export type ControlValue = CoreValue & { control: FormControl };
