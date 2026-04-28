import { UserRole } from "./misc";

export interface UserCustomerDto {
    id: string;
    name: string;
    email: string;
    rol: UserRole;
}
