/* eslint-disable radix */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, first, retry } from 'rxjs/operators';
import { ChatRoomList } from '../ChatRoomList';
import { ChatHistories } from '../conversation';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public chats: BehaviorSubject<ChatRoomList> =
    new BehaviorSubject<ChatRoomList>(null);
    chatHistories: ChatHistories[];


  private REST_API_SERVER = 'https://family-chat-java-websocket.herokuapp.com';

  constructor(private httpClient: HttpClient) {
    console.log('ChatService getAllChats');
    this.getAllChats();
  }

  getAllChats() {
    this.httpClient
      .get<ChatRoomList>(this.REST_API_SERVER + '/chats')
      .pipe(retry(1), catchError(this.processError))
      .subscribe((c) => {
        this.chats.next(c);
      });
  }

  // addChatHistory(chatRoomId: string, chatText: string, sender: string, created: string) {
  //   let historyChat: ChatHistories = {
  //     chatHistoryId: Math.random().toString(),
  //     chatText,
  //     sendFrom: sender,
  //     sendTo: 'Malak',
  //     created: new Date().getTime().toString(),
  //   };
  //   this.chats.pipe(first()).subscribe((chats) => {
  //     let chatRoom = chats.chatRoomDtoList.find(
  //       (chat) => chatRoomId === chat.chatRoomId
  //     );
  //     chatRoom.chatHistories.push(historyChat);
  //   });
  // }

  getUsersData() {
    const url = '../../assets/data/users.json';
    return this.httpClient.get(url);
  }

  processError(err) {
    let message = '';
    if (err.error instanceof ErrorEvent) {
      message = err.error.message;
    } else {
      message = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    console.log(message);
    return throwError(message);
  }
}
