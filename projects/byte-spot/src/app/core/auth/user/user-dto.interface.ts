import { Role } from './role.enum';

export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    companyId?: string;
}
