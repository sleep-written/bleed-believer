import { Post } from './post.entity';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    posts?: Post[] | null;
}