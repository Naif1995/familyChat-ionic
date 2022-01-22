/* eslint-disable @typescript-eslint/quotes */
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { IonicModule } from "@ionic/angular";
import { ChatPhotoComponent } from "./chat-photo.component";
import { MatCardModule } from '@angular/material/card';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDialogModule,
    MatCardModule
  ],
  declarations: [ChatPhotoComponent]
})
export class ChatPhotoModule {}
