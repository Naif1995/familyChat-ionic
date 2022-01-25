/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: any;
  greetings: string[] = [];
  disabled = true;
  name: string;
  private stompClient = null;
  constructor() {
    this.connect();
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

  connect() {
    const socket = new SockJS('https://family-chat-java-websocket.herokuapp.com/socket');//https://family-chat-java-websocket.herokuapp.com/socket
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect( (frame: string) => {
      _this.setConnected(true);
      console.log('Connected: ' + frame);
    });
  }
  subscribeChat(chatName: string) {
    this.stompClient.subscribe('/message/' + chatName, (hello: any) => {
      console.log(hello.body);
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }

  sendMessage(chatName: string) {
    this.stompClient.send(
      '/app/send/message/' + chatName,
      {},
      JSON.stringify({ name: 'Naif' })
    );
  }
}
