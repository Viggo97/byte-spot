import { UserDto } from './user-dto.interface';
import { Role } from './role.enum';

export class User {
    readonly id: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly role: Role;
    readonly companyId?: string;

    constructor(id: string, email: string, firstName: string, lastName: string, role: Role, companyId?: string) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.companyId = companyId;
    }

    static fromDto(dto: UserDto): User {
        return new User(dto.id, dto.email, dto.firstName, dto.lastName, dto.role, dto.companyId);
    }
}
