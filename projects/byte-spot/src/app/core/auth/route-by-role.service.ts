import { Service } from '@angular/core';
import { Role } from './user/role.enum';

@Service()
export class RouteByRoleService {
    private _role: Role | null = null;

    init(role: Role): void {
        if (!this._role) {
            this._role = role;
        }
    }

    getPath(): string {
        if (!this._role) {
            throw new Error('Role is not initialized');
        }

        switch (this._role) {
            case Role.Admin:
                return '/admin';
            case Role.Employer:
                return '/employer';
            case Role.Recruiter:
                return '/recruiter';
            case Role.Candidate:
                return '/candidate';
            default:
                throw new Error('Invalid role');
        }
    }

    getProfilePath(): string {
        return this.getPath() + '/profile';
    }
}
