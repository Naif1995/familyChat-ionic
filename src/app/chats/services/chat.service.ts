/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ChatRoomList } from '../ChatRoomList';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public chats: BehaviorSubject<ChatRoomList> = new BehaviorSubject<ChatRoomList>(null);

  private REST_API_SERVER = 'https://family-chat-java-websocket.herokuapp.com';

  constructor(private httpClient: HttpClient) {
    this.httpClient
      .get<ChatRoomList>(this.REST_API_SERVER + '/chats')
      .pipe(retry(1), catchError(this.processError))
      .subscribe((c) => {
        this.chats.next(c);
      });
  }

  // get chats() {
  //   // eslint-disable-next-line no-underscore-dangle
  //   return [...this._chats];
  // }

  getChatsFromServer(): Observable<ChatRoomList> {
    return this.httpClient
      .get<ChatRoomList>(this.REST_API_SERVER + '/chats')
      .pipe(retry(1), catchError(this.processError));
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

  // getChat(id: string) {
  //   // eslint-disable-next-line no-underscore-dangle
  //   return {...this.c.find(p => p.id === id)};
  // }
}
