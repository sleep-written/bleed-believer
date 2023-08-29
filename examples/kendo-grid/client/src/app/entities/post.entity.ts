import { User } from './user.entity';

export interface Post {
    id: number;
    title: string;
    body: string;
    user?: User | null;
}