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
    //this.connectOld();//https://family-chat-java-websocket.herokuapp.com/socket
    this.client = Stomp.over(new SockJS('http://localhost:8081/socket'));
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

  ngOnDestroy() {
    this.connect()
      .pipe(first())
      .subscribe((client) => client.disconnect(null));
  }

  // onMessage(topic: string, handler = SocketService.jsonHandler): Observable<any> {
  //   return this.connect().pipe(first(), switchMap(client => {
  //     return new Observable<any>(observer => {
  //       const subscription: StompSubscription = client.subscribe(topic, message => {
  //         observer.next(handler(message));
  //       });
  //       return () => client.unsubscribe(subscription .id);
  //     });
  //   }));
  // }

  // static jsonHandler(message: Message): any {
  //   return JSON.parse(message.body);
  // }

  // onPlainMessage(topic: string): Observable<string> {
  //   return this.onMessage(topic, SocketService.textHandler);
  // }
  // static textHandler(message: Message): string {
  //   return message.body;
  // }

  send(topic: string, payload: any): void {
    console.log(this.connect());
    this.connect()
      .pipe(first())
      .subscribe((client) => client.send(topic, {}, JSON.stringify(payload)));
  }

  socket: any;
  greetings: string[] = [];
  disabled = true;
  name: string;
  connected = false;

  public stompClient = null;

  connectOld() {
    const socket = new SockJS(
      'https://family-chat-java-websocket.herokuapp.com/socket'
    ); //https://family-chat-java-websocket.herokuapp.com/socket
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: string) => {});
    console.log('Naif stompClient');
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    console.log('Disconnected!');
  }

  sendMessage(
    chatRoomId: string,
    chatText: string,
    sendFrom: string,
    sendTo: string,
    created: string
  ) {
    this.stompClient.send(
      '/app/send/message/' + chatRoomId,
      {},
      JSON.stringify({ chatRoomId, chatText, sendFrom, sendTo, created })
    );
  }

  subscribeChat(chatRoomId: string) {
    this.stompClient.subscribe('/message/' + chatRoomId, (body: any) => {
      const chatRequest: ChatRequest = JSON.parse(body.body);
      const chatHistory: ChatHistories = {
        chatHistoryId: '',
        sendFrom: chatRequest.sendFrom,
        sendTo: 'Malak',
        chatText: chatRequest.chatText,
        created: chatRequest.created,
      };
      this.chatService.chatHistories.push(chatHistory);
    });
  }
}
