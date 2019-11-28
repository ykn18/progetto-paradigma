import { User } from './user';
import { Identifiers } from '@angular/compiler';

export interface NewTweet {
    tweet: string;
    parent?: string;
}

export interface Tweet {
    created_at: string;
    _id: string;
    tweet: string;
    _author: User;
}
