import { Roles } from './role.enum';

export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Roles;
}
