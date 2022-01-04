import { Conversation } from './conversation';

export class Chat {
    public id: string;
    public title: string;
    public description: string;
    public imageUrl: string;
    public conversation: Conversation[];
}
