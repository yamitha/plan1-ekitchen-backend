export interface Roles {
    administrator?: boolean;
    customer?: boolean;
    kitchen?: boolean;
}

export class User {
    fullName: string;
    email: string;
    roles: Roles;
    addedOn: string;
}
