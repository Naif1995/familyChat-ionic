import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatDetailsPageRoutingModule } from './chat-details-routing.module';

import { ChatDetailsPage } from './chat-details.page';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatDetailsPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule
  ],
  declarations: [ChatDetailsPage]
})
export class ChatDetailsPageModule {}
