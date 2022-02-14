import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatRoomPhotoPageRoutingModule } from './chat-room-photo-routing.module';

import { ChatRoomPhotoPage } from './chat-room-photo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatRoomPhotoPageRoutingModule
  ],
  declarations: [ChatRoomPhotoPage]
})
export class ChatRoomPhotoPageModule {}
