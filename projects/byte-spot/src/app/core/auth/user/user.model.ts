import { Role } from './role.enum';

export class User {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly role: Role;

    constructor(id: string, firstName: string, lastName: string, role: Role) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }
}
