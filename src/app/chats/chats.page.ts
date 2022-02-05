/* eslint-disable space-before-function-paren */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonRouterOutlet,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../auth/services/authentication.service';
import { User } from '../auth/services/user.module';
import { CreateChatPage } from './create-chat/create-chat.page';
import { ChatService } from './services/chat.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chats;
  user: User;

  constructor(
    private chatService: ChatService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    public navCtrl: NavController
  ) {}

  ngOnInit() {
    this.chatService.chats.subscribe((c) => {
      if (c) {
        this.chats = c.chatRoomDtoList;
      }
    });
    this.route.queryParams.subscribe(() => {
      this.authService.getUserData().then((user: User) => {
        this.user = user;
        console.log(this.user);
      });
    });
  }

  routeToChat(chatId: string){
    console.log(chatId);
    this.navCtrl.navigateForward('chats/chat-room/'+chatId);
  }

  openCreateChatModal() {
    this.modalCtrl
      .create({
        component: CreateChatPage,
        componentProps: { root: 'CreateChatPage' },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          console.log('BOOKED!');
        }
      });
  }

  printUser() {
    console.log(this.user.id);
  }
}
