export type UserRole = "customer" | "business";
export interface UserDto {
    id: string;
    name: string;
    email: string;
    rol: UserRole;
}
