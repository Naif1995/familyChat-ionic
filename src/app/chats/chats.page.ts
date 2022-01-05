import { Component, OnInit } from '@angular/core';
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
  constructor(private chatService: ChatService,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet) {}

  ngOnInit() {
    this.chats = this.chatService.chats;
  }

openCreateChatModal() {
  // this.router.navigateByUrl('/places/tabs/discover');
  // this.navCtrl.navigateBack('/places/tabs/discover');
  // this.navCtrl.pop();
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
