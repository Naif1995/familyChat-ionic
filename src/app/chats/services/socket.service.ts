/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Client, Message, Stomp, StompSubscription } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatHistories } from '../conversation';
import { ChatService } from './chat.service';
import { ChatRequest } from './ChatRequest';
import { filter, first, switchMap, tap } from 'rxjs/operators';

export enum SocketClientState {
  ATTEMPTING,
  CONNECTED,
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private client: any;
  private state: BehaviorSubject<SocketClientState>;

  constructor(private chatService: ChatService) {
    //https://family-chat-java-websocket.herokuapp.com/socket
    this.client = Stomp.over(new SockJS('https://family-chat-java-websocket.herokuapp.com/socket'));
    this.state = new BehaviorSubject<SocketClientState>(
      SocketClientState.ATTEMPTING
    );
    this.client.connect({}, () => {
      this.state.next(SocketClientState.CONNECTED);
      this.client.subscribe('/message/rooms', (message) => {
        const payload = JSON.parse(message.body);
        this.chatService.chatHistories.push(payload);
      });
    });
  }

  private connect(): Observable<any> {
    console.log('before set state ');
    return new Observable<Client>((observer) => {
      this.state
        .pipe(
          tap((val) => {
            console.log('state ', val);
          }),
          filter((state) => state === SocketClientState.CONNECTED)
        )
        .subscribe(() => {
          observer.next(this.client);
        });
    });
  }

  send(topic: string, payload: any): void {
    console.log(this.connect());
    this.connect()
      .pipe(first())
      .subscribe((client) => client.send(topic, {}, JSON.stringify(payload)));
  }

  ngOnDestroy() {
    this.connect()
      .pipe(first())
      .subscribe((client) => client.disconnect(null));
  }

}
