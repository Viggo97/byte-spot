export class ServerError {
    code: string;
    reason: string;

    constructor(code: string, reason: string) {
        this.code = code;
        this.reason = reason;
    }

    static tryParse(error: unknown): ServerError | null {
        if (!error || typeof error !== 'object') {
            return null;
        }

        if (!('code' in error) || typeof error.code !== 'string') {
            return null;
        }

        if (!('reason' in error) || typeof error.reason !== 'string') {
            return null;
        }

        return new ServerError(error.code, error.reason);
    }
}
