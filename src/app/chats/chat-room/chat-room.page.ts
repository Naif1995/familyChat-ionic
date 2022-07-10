/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prefer-const */
/* eslint-disable arrow-body-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable radix */
import {
  Component,
  ElementRef,
  IterableDiffers,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  AnimationController,
  IonContent,
  IonInfiniteScroll,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Chat } from '../chat';
import { ChatService } from '../services/chat.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { User } from 'src/app/auth/services/user.module';
import { SocketService } from '../services/socket.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileService } from '../services/file.service';
import { map, tap } from 'rxjs/operators';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChatRoomPhotoPage } from './chat-room-photo/chat-room-photo.page';
import { ChatHistories } from '../conversation';
import { UserService } from '../services/user.service';

const IMAGE_DIR = 'stored-images';
const ALLOW_MESSAGES = 8;
const NUM_PIXEL = 100;

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
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  public virtualScrollViewport?: CdkVirtualScrollViewport;
  chat: Chat;
  user: User;
  chatForm: FormGroup;
  firstLoad = true;
  chatRoomId;
  differ: any;
  images: LocalFile[];
  chatHistory: any = [];
  chatHistoriesView: ChatHistories[];
  lock = true;
  numberMessages = 0;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public chatService: ChatService,
    public alertController: AlertController,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private socketService: SocketService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private fileService: FileService,
    private animationCtrl: AnimationController,
    differs: IterableDiffers,
    private vibration: Vibration,
    private modalCtrl: ModalController,
    //TODO when refresh page need get user date after lose it.
    public userService: UserService
  ) {
    this.chatForm = this.formBuilder.group({
      chatText: [''],
    });
    this.differ = differs.find([]).create(null);
  }

  ngDoCheck() {
    const change = this.differ.diff(this.chatService.chatHistories);
    if (change) {
      console.log(change);
      setTimeout(() => {
        this.content.scrollToBottom(100);
      }, 300);
    }
  }

  ionViewDidEnter() {
    this.route.paramMap.pipe().subscribe(async (paramMap) => {
      if (!paramMap.has('chatId')) {
        this.navCtrl.navigateBack('/chats');
        return;
      }
      this.chatRoomId = paramMap.get('chatId');
      this.getChatRoom(this.chatRoomId);
    });
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1);
    console.log('ionViewDidEnter');
    // this.loadFiles();
  }
  ngOnInit() {}
  getChatRoom(chatRoomIdParam) {
    return this.chatService.chats
      .pipe(
        map((val) => {
          if (val) {
            return val.chatRoomDtoList.find((obj) => {
              const chatRoomId = parseInt(obj.chatRoomId);
              const paramValue = parseInt(chatRoomIdParam);
              return chatRoomId === paramValue;
            });
          }
        }),
        tap((val) => {
          if (val) {
            this.chat = val;
            this.chatHistoriesView = val.chatHistories.slice(
              ALLOW_MESSAGES * -1
            );
            this.chatHistoriesView = this.chatHistoriesView.reverse();
            this.chatService.chatHistories = val.chatHistories;
          }
        })
      )
      .subscribe(() => {
        setTimeout(() => {
          this.content.scrollToBottom();
        }, 1);
      });
  }

  doVibrationFor() {
    this.vibration.vibrate(10000);
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
    this.socketService.send('/app/send/message/rooms', {
      chatRoomId: this.chat.chatRoomId,
      chatText: this.chatForm.get('chatText').value,
      sendFrom: this.userService.user.name,
      sendTo: 'M',
      created: new Date().getTime().toString(),
    });
    this.vibration.vibrate(1000);
    this.chatForm.get('chatText').reset();
  }

  openDialog() {
    this.modalCtrl
      .create({
        component: ChatRoomPhotoPage,
        componentProps: { imageUrl: this.chat?.imageChat },
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(resultData.data);
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
  loadData(event) {
    let minChatHistoriesId = 0;
    setTimeout(() => {
      if (!this.firstLoad) {
        this.numberMessages = this.numberMessages + ALLOW_MESSAGES;
        const chatHistoriesViewTemp: ChatHistories[] =
          this.chatService.chatHistories.slice(this.numberMessages * -1);
        //get min ID in list to avoid dublication
        minChatHistoriesId = Math.min(
          ...chatHistoriesViewTemp.map((o) => parseInt(o.chatHistoryId))
        );
        let missing: ChatHistories[] = [
          ...chatHistoriesViewTemp.filter(
            (x) => !this.chatHistoriesView?.includes(x)
          ),
        ];
        missing = missing.reverse();
        if (missing.length !== 0) {
          for (let i = 0; i < ALLOW_MESSAGES; i++) {
            //console.log('missing', missing[i]);
            if (typeof missing[i] !== 'undefined') {
              this.chatHistoriesView.push(missing[i]);
            }
          }
        }
        //console.log('this.chatHistoriesView', this.chatHistoriesView);
      }
     event.target.complete();
    }, 200);
  }

  logScrollStart(event) {
    // console.log("logScrollStart : When Scroll Starts", event);
  }

  logScrolling(event) {
    if (event.detail.scrollTop <= 100) {
      this.firstLoad = false;
    }
    // console.log('logScrolling : When Scrolling', event);
    // console.log('deltaY : deltaY', event.detail.deltaY);
    //reach top of page
    // if (event.detail.scrollTop <= 100 && this.lock
    //   ) {
    //   this.lock = false;
    // setTimeout(() => {
    // this.numberMessages = this.numberMessages + ALLOW_MESSAGES;
    // this.chatHistoriesView = this.chatService.chatHistories.slice(
    //   this.numberMessages * -1
    // );
    //  this.lock = true;
    //  this.infiniteScroll.disabled = false;
    // this.content.scrollToPoint(0, NUM_PIXEL);
    // console.log('number of messages ',  this.numberMessages);
    // console.log('ADD MORE DATA');
    // }, 500);
    // }
  }

  logScrollEnd(event) {
    this.infiniteScroll.disabled = false;
    // console.log('logScrollEnd : When Scroll Ends', event);
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
      ]);

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
