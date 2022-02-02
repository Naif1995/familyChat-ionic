import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  messages =[
    {
      user:'Naif',
      createdAt:'1643826129',
      msg:'Hi how are You!'
    },
    {
      user:'Malak',
      createdAt:'1643826129',
      msg:'Hi how are You!'
    },
    {
      user:'Naif',
      createdAt:'1643826129',
      msg:'Hi how are You!'
    }
  ];
  currentUser = 'Naif';
  newMsg;
  constructor() { }


  ngOnInit() {
  }
  sendMessage() {
    this.messages.push(
      {
        user:'simon',
        createdAt:new Date().getTime().toString(),
        msg:this.newMsg
      }
    );
    setTimeout(() => {
      this.content.scrollToBottom(200);
    });
  }




}
