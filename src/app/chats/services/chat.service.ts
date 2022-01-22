/* eslint-disable max-len */
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
            from:'mohammedssssssssssssss',
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
    {
      id: 'c2',
      description: 'Chat 2',
      title: 'chat 2',
      imageUrl:
        'https://images.unsplash.com/photo-1508610048659-a06b669e3321?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
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
            from:'mohammedssssssssssssss',
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
  constructor() {

  }

  get chats() {
    // eslint-disable-next-line no-underscore-dangle
    return [...this._chats];
  }



  getChat(id: string) {
    // eslint-disable-next-line no-underscore-dangle
    return {...this._chats.find(p => p.id === id)};
  }
}
