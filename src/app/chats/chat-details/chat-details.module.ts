import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatDetailsPageRoutingModule } from './chat-details-routing.module';

import { ChatDetailsPage } from './chat-details.page';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatDetailsPageRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    HttpClientModule
  ],
  declarations: [ChatDetailsPage]
})
export class ChatDetailsPageModule {}
