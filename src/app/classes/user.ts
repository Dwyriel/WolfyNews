export class User {
    id: string;
    name: string;
    password: string;
    email: string;
    userType: UserType;
    photo: string;
}

export enum UserType{
    Admin,
    Editor,
    User
}