/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable radix */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  AnimationController,
  IonContent,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Chat } from '../chat';
import { ChatHistories } from '../conversation';
import { ChatService } from '../services/chat.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { User } from 'src/app/auth/services/user.module';
import { SocketService } from '../services/socket.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileService } from '../services/file.service';
import { ChatPhotoComponent } from '../chat-details/chat-photo/chat-photo.component';
import { first } from 'rxjs/operators';

const IMAGE_DIR = 'stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  chat: Chat;
  user: User;
  chatForm: FormGroup;
  firstLoad =true;
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
    private fileService: FileService,
    private animationCtrl: AnimationController
      ) {
    this.chatForm = this.formBuilder.group({
      chatText: [''],
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
    this.socketService.subscribeChat(this.chat.chatRoomId);
    this.firstLoad=false;
    },700);
  }
  ngOnInit() {
    this.route.paramMap.pipe()
    .subscribe((paramMap) => {
      if (!paramMap.has('chatId')) {
        this.navCtrl.navigateBack('/chats');
        return;
      }
      this.chatService.chats.pipe().subscribe((c) => {
        if (c) {
          console.log(c);
          this.chat = c.chatRoomDtoList.find((obj) => {
            const chatRoomId = parseInt(obj.chatRoomId);
            const paramValue = parseInt(paramMap.get('chatId'));
            return chatRoomId === paramValue;
          });
          setTimeout(() => {
            this.content.scrollToBottom(500);
            if(!this.firstLoad) {
            this.animateButton(
              this.chat.chatHistories[this.chat.chatHistories.length - 1]
                .chatHistoryId
            );
            }
          }, 100);
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
    this.socketService.sendMessage(
      this.chat.chatRoomId,
      this.chatForm.get('chatText').value,
      this.user.name,
      'Malak',
      new Date().getTime().toString()
    );
    this.chatForm.get('chatText').reset();
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

  public animateButton(chahHistoryId: string) {
    const animation = this.animationCtrl
      .create()
      .addElement(document.getElementById('chat_' + chahHistoryId))
      .duration(1500)
      .iterations(3)
      // .fromTo('background','#fff','#bcc0d2');
      .keyframes([
        { offset: 0, boxShadow: '0 0 0 0 rgba(44, 103, 255, 0.4)' },
        { offset: 0.7, boxShadow: '0 0 0 10px rgba(44, 103, 255, 0)' },
        { offset: 1, boxShadow: '0 0 0 0 rgba(44, 103, 255, 0)' },
      ]
      );

    animation.play();
  }

  rowSize(msg: string) {
    if (msg.length < 10) {
      return 3;
    } else if (msg.length >= 10 && msg.length <= 16) {
      return 4;
    } else if (msg.length >= 16 && msg.length <= 20) {
      return 5;
    } else if (msg.length >= 21 && msg.length <= 25) {
      return 6;
    } else {
      return 7;
    }
  }

  myoffSetSize(msg: string) {
    if (msg.length < 10) {
      return 9;
    } else if (msg.length >= 10 && msg.length <= 16) {
      return 8;
    } else if (msg.length >= 16 && msg.length <= 20) {
      return 7;
    } else if (msg.length >= 21 && msg.length <= 25) {
      return 6;
    } else {
      return 5;
    }
  }

  myRowSize(msg: string) {
    if (msg.length < 10) {
      return 3;
    } else if (msg.length >= 10 && msg.length <= 16) {
      return 4;
    } else if (msg.length >= 16 && msg.length <= 20) {
      return 5;
    } else if (msg.length >= 21 && msg.length <= 25) {
      return 6;
    } else {
      return 7;
    }
  }
}
