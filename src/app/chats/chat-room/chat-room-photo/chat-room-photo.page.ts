import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chat-room-photo',
  templateUrl: './chat-room-photo.page.html',
  styleUrls: ['./chat-room-photo.page.scss'],
})
export class ChatRoomPhotoPage implements OnInit {

  @Input() imageUrl: string;
  constructor(
    private modalController: ModalController,
  ) { }
  ngOnInit() { }
  async closeModel() {
    const close = 'Modal Removed';
    await this.modalController.dismiss(close);
  }
}
