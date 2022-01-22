import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../auth/services/authentication.service';
import { StorageService } from '../auth/services/storage.service';
import { User } from '../auth/services/user.module';
import { CreateChatPage } from './create-chat/create-chat.page';
import { ChatService } from './services/chat.service';

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
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.chats = this.chatService.chats;
    this.route.queryParams.subscribe(() => {
      this.authService.getUserData().then((user: User) => {
        this.user = user;
      });
    });
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
