/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
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
  connected = false;

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

  getConnected() {
    return this.connected;
  }

  connect() {
    const socket = new SockJS('https://family-chat-java-websocket.herokuapp.com/socket'); //https://family-chat-java-websocket.herokuapp.com/socket
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: string) => {
      this.setConnected(true);
      this.connected = true;
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
