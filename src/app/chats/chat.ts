import { ChatHistories } from './conversation';

export class Chat {
    public chatRoomId: string;
    public chatName: string;
    public title: string;
    public description: string;
    public imageChat: string;
    public chatHistories: ChatHistories[];
}
