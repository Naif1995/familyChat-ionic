import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  imageUrl: string;
}

@Component({
  selector: 'app-chat-photo',
  templateUrl: './chat-photo.component.html',
  styleUrls: ['./chat-photo.component.scss'],
})
export class ChatPhotoComponent implements OnInit {

  imageUrl: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
  public dialogRef: MatDialogRef<ChatPhotoComponent>) {}

  ngOnInit() {
    console.log(this.data);
    this.imageUrl = this.data.imageUrl;
  }

  closeDialog() {
    // this.dialogRef.afterClosed().subscribe(() => console.log('close works'));
    this.dialogRef.close();
  }


}
