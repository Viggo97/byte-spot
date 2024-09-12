import { FormControl } from '@angular/forms';

import { Location } from '../interfaces/location.interface';

export type LocationControl = Location & { control: FormControl<boolean> };
