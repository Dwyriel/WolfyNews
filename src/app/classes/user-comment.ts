import { User } from "./user";
export class UserComment {
    id: string;
    text: string;
    date: Date;
    userId: string;
    user: User;
}
