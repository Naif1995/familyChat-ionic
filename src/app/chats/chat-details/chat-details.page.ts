import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Chat } from '../chat';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.page.html',
  styleUrls: ['./chat-details.page.scss'],
})
export class ChatDetailsPage implements OnInit {
  chat: Chat;
  currentUser = 'Naif';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private chatService: ChatService,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('chatId')) {
        this.navCtrl.navigateBack('/chats');
        return;
      }
      this.chat = this.chatService.getChat(paramMap.get('chatId'));
    });
  }

  sendMessage() {

  }

  testButtons() {
    console.log('it works');
  }
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      cssClass:'my-custom-class',
      subHeader: 'Subtitle for alert',
      message: 'This is an alert message.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
