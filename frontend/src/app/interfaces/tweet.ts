import { User } from './user';

export interface NewTweet {
    tweet: string;
    parent?: string;
}

export interface Tweet {
    created_at: string;
    _id: string;
    tweet: string;
    _author: User;
    likes: User[];
    comments: Tweet[];
}
