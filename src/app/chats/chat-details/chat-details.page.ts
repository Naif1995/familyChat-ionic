import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Chat } from '../chat';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.page.html',
  styleUrls: ['./chat-details.page.scss'],
})
export class ChatDetailsPage implements OnInit {
  chat: Chat;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private chatService: ChatService
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
}
