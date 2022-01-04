import { Injectable } from '@angular/core';
import { Chat } from '../chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _chats: Chat[] = [
    {
      id: 'c1',
      description: 'Chat 1',
      title: 'chat 1',
      imageUrl:
        'https://thumbs.dreamstime.com/z/gorgeous-frangipani-flowers-6647154.jpg',
        conversation:[
          {
            id:'conversation1',
            text:'Hi mohammed',
            from:'Naif',
            to:'mohammed',
            created:new Date().toDateString()
          },
          {
            id:'conversation1',
            text:'Hi Naif',
            from:'mohammed',
            to:'Naif',
            created:new Date().toDateString()
          },
          {
            id:'conversation1',
            text:'How are you Naif we miss you so much i hope ypu fine?',
            from:'mohammed',
            to:'Naif',
            created:new Date().toDateString()
          },
          {
            id:'conversation1',
            text:'Thank you so much Mohammed for asking about me i am fine what about you and your family',
            from:'Naif',
            to:'mohammed',
            created:new Date().toDateString()
          },
          {
            id:'conversation1',
            text:'Hi mohammed',
            from:'Naif',
            to:'mohammed',
            created:new Date().toDateString()
          }
        ]
    },
  ];
  constructor() {}

  get chats() {
    // eslint-disable-next-line no-underscore-dangle
    return [...this._chats];
  }



  getChat(id: string) {
    // eslint-disable-next-line no-underscore-dangle
    return {...this._chats.find(p => p.id === id)};
  }
}
