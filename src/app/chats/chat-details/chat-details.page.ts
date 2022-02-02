/* eslint-disable radix */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-const */
/* eslint-disable new-parens */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Chat } from '../chat';
import {ChatHistories} from '../conversation';
import { ChatService } from '../services/chat.service';
import { MatDialog } from '@angular/material/dialog';
import { ChatPhotoComponent } from './chat-photo/chat-photo.component';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { User } from 'src/app/auth/services/user.module';
import { SocketService } from '../services/socket.service';
import { FormBuilder } from '@angular/forms';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileService } from '../services/file.service';

const IMAGE_DIR = 'stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.page.html',
  styleUrls: ['./chat-details.page.scss'],
})
export class ChatDetailsPage implements OnInit {
  chat: Chat;
  user: User;
  chatForm;

  images: LocalFile[];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private chatService: ChatService,
    public alertController: AlertController,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private socketService: SocketService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private fileService: FileService
  ) {
    this.chatForm = this.formBuilder.group({
      chatText: [''],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('chatId')) {
        this.navCtrl.navigateBack('/chats');
        return;
      }
      this.chatService.chats.subscribe((c) => {
        if (c) {
          this.chat = c.chatRoomDtoList.find((obj) => {
            const chatRoomId = parseInt(obj.chatRoomId);
            const paramValue = parseInt(paramMap.get('chatId'));
            return chatRoomId === paramValue;
          });
          if (this.chat) {
            this.socketService.subscribeChat(this.chat.chatRoomId);
          }
        }
      });
    });
    this.authService.getUserData().then((user: User) => {
      this.user = user;
    });
    this.loadFiles();
  }

  async loadFiles() {
    this.images = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading data...',
    });
    await loading.present();

    Filesystem.readdir({
      path: IMAGE_DIR,
      directory: Directory.Data,
    })
      .then(
        (result) => {
          this.fileService.loadFileData(result.files);
        },
        async () => {
          // Folder does not yet exists!
          await Filesystem.mkdir({
            path: IMAGE_DIR,
            directory: Directory.Data,
          });
        }
      )
      .then((_) => {
        loading.dismiss();
      });
  }

  sendMessage() {
    console.log(this.chatForm.get('chatText').value);
    this.socketService.sendMessage(
      this.chat.chatRoomId,
      this.chatForm.get('chatText').value,
      this.user.name,
      'Malak',
      new Date().getTime().toString()
    );
    this.addChatHistory(this.chatForm.get('chatText').value);
    this.chatForm.get('chatText').reset();
  }

  addChatHistory(chatText: string) {
    let historyChat: ChatHistories = {
      chatHistoryId:Math.random().toString(),
      chatText,
      sendFrom: this.user.name,
      sendTo: 'Malak',
      created: new Date().getTime().toString()
    };
    this.chat.chatHistories.push(historyChat);
  }

  openDialog() {
    this.dialog.open(ChatPhotoComponent, {
      data: {
        imageUrl: this.chat.imageChat,
      },
    });
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt, // Camera, Photos or Prompt!
    });
    console.log(Image);
    if (image) {
      this.fileService.saveImage(image);
    }
  }
}
