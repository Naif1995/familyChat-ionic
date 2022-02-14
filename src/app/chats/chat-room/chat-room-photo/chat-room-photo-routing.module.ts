import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatRoomPhotoPage } from './chat-room-photo.page';

const routes: Routes = [
  {
    path: '',
    component: ChatRoomPhotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoomPhotoPageRoutingModule {}
