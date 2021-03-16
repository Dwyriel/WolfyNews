import { User } from "./user";

export class Article {
    id: string;
    active: boolean;
    title: string;
    content: string;
    authorId: string;
    author: User;
}
