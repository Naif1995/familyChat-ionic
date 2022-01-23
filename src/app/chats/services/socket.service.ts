/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Client, Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;
  greetings: string[] = [];
  disabled = true;
  name: string;
  private stompClient = null;
  constructor() {
    // this.socket = io.connect('http://localhost:3000/');
    this.connect();

   }


   setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

  connect() {
    const socket = new SockJS('http://localhost:8081/socket');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function(frame: string) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      // _this.stompClient.subscribe('/message', function(hello: any) {
      //   console.log(hello);
      // });
    });
  }
  subscribeChat(chatName: string) {
    this.stompClient.subscribe('/message/'+chatName, function(hello: any) {
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

  sendName(chatName: string) {
    this.stompClient.send(
      '/app/send/message/'+chatName,
      {},
      JSON.stringify({ name: 'Naif' })
    );
  }



}
