/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs';
import { ChatHistories } from '../conversation';
import { ChatService } from './chat.service';
import { ChatRequest } from './ChatRequest';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: any;
  greetings: string[] = [];
  disabled = true;
  name: string;
  connected = false;

  public stompClient = null;
  constructor(private chatService: ChatService) {
    this.connect();
  }

  connect() {
    const socket = new SockJS('http://localhost:8081/socket'); //https://family-chat-java-websocket.herokuapp.com/socket
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame: string) => {});
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
      this.chatService.addChatHistory(
        chatRequest.chatRoomId,
        chatRequest.chatText,
        chatRequest.sendFrom,
        chatRequest.created
      );
    });
  }
}
