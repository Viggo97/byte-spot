import { FormControl } from '@angular/forms';

import { Technology } from '../interfaces/technology.interface';

export type TechnologyControl = Technology & { control: FormControl };
