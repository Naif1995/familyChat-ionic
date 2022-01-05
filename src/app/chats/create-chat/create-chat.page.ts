import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.page.html',
  styleUrls: ['./create-chat.page.scss'],
})
export class CreateChatPage implements OnInit {

  @Input()root;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.root);
  }

  colseCreateChatModal() {
    this.modalCtrl.dismiss(null, 'cancel');

  }

}
