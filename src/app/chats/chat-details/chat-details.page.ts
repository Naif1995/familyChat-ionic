import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Chat } from '../chat';
import { ChatService } from '../services/chat.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatPhotoComponent } from './chat-photo/chat-photo.component';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { User } from 'src/app/auth/services/user.module';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.page.html',
  styleUrls: ['./chat-details.page.scss'],
})
export class ChatDetailsPage implements OnInit {
  chat: Chat;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private chatService: ChatService,
    public alertController: AlertController,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('chatId')) {
        this.navCtrl.navigateBack('/chats');
        return;
      }
      this.chat = this.chatService.getChat(paramMap.get('chatId'));
    });
    this.authService.getUserData().then((user: User) => {
      this.user = user;
    });
    this.socketService.subscribeChat(this.chat.id);
  }

  sendMessage() {
    console.log(this.chat.id);
    this.socketService.sendMessage(this.chat.id);
  }

  testButtons() {
    console.log('it works');
  }
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      cssClass: 'my-custom-class',
      subHeader: 'Subtitle for alert',
      message: 'This is an alert message.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  openDialog() {
    this.dialog.open(ChatPhotoComponent, {
      data: {
        imageUrl: this.chat.imageUrl,
      },
    });
  }
}
