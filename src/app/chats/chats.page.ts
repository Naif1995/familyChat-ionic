import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { CreateChatPage } from './create-chat/create-chat.page';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chats;
  user: any;

  constructor(private chatService: ChatService,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit() {
    this.chats = this.chatService.chats;
    this.route.queryParams.subscribe(params => {
      const data = this.router.getCurrentNavigation().extras.state;
      if (data.user) {
          this.user = data.user;
      }
    });
  }

openCreateChatModal() {
  this.modalCtrl
  .create({
    component: CreateChatPage,
    componentProps: {   root: 'CreateChatPage'  }
  })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('BOOKED!');
      }
    });
}







}
