import { HttpParams } from '@angular/common/http';

export function HttpParamsConverter(valueToConversion: Record<string, unknown>): HttpParams {
    let params = new HttpParams();

    Object.keys(valueToConversion).forEach(key => {
        const value = valueToConversion[key];

        if (value === null || value === undefined || value === '') {
            return;
        }

        if (typeof value === 'boolean' && !value) {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach(item => {
                params = params.append(key, String(item));
            });
            return;
        }

        if (value instanceof Date) {
            params = params.append(key, value.getTime());
            return;
        }

        if (typeof value === 'object') {
            params = params.append(key, JSON.stringify(value));
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        params = params.append(key, String(value));
    });

    return params;
}
