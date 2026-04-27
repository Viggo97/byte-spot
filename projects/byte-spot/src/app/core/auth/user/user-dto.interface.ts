import { Role } from './role.enum';

export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
}
