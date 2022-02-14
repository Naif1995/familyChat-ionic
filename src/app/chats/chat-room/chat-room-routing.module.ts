import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatRoomPage } from './chat-room.page';

const routes: Routes = [
  {
    path: ':chatId',
    component: ChatRoomPage
  },
  {
    path: 'chat-room-photo',
    loadChildren: () => import('./chat-room-photo/chat-room-photo.module').then( m => m.ChatRoomPhotoPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoomPageRoutingModule {}
