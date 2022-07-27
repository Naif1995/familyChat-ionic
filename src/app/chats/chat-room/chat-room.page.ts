/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
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
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  IterableDiffers,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AlertController,
  AnimationController,
  IonContent,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
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
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('viewportRef')
  public viewportRef!: ElementRef;
  currentPosition = window.pageYOffset;
  ScrollHeight;
  scroll;
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
  missing: ChatHistories[] = [];
  footerHidden: boolean;
  public lastScrollTop = 0;
  public demoType: 'window' | 'container';

  private changeDetectionRef: ChangeDetectorRef;

  constructor(
    changeDetectionRef: ChangeDetectorRef,
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
    this.changeDetectionRef = changeDetectionRef;
  }

  // @HostListener('window:scroll', ['$event.target']) // for window scroll events
  // async scroll(e: { scrollingElement: { scrollTop: any } }) {
  //   let scroll = e.scrollingElement.scrollTop;
  //   console.log('this is the scroll position', scroll);
  //   console.log('Height', this.getContainerScrollHeight());
  //   if (scroll > this.currentPosition) {
  //     console.log('scrollDown');
  //   } else {
  //     console.log('scrollUp');
  //     // reach top of page
  //     if (await this.getContainerScrollHeight() / scroll > 5) {
  //       this.addNewsItem();
  //     }
  //   }
  //   this.currentPosition = scroll;
  // }

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
            this.chatHistoriesView = val.chatHistories.slice(16 * -1);
            //this.chatHistoriesView = this.chatHistoriesView.reverse();
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
  async onScroll(ev) {
    this.getContainerScrollTop().then((e) => {
      this.scroll = e;
      console.log('this is the scroll position ', e);
    });
    this.getContainerScrollHeight().then((e) => {
      //619 is addtional component since we are using ion content not ineer componenet
      this.ScrollHeight = e - 619;
      console.log('Height ', this.ScrollHeight);
    });
    if (this.scroll > this.currentPosition) {
      console.log('scrollDown');
    } else {
      console.log('scrollUp');
      // reach top of page
      if (this.ScrollHeight / this.scroll > 5) {
        this.addNewsItem();
        console.log('addNewsItem');
      }
    }
    this.currentPosition = this.scroll;
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
  async loadData(event) {
    setTimeout(() => {
      if (!this.firstLoad) {
        this.numberMessages = this.numberMessages + ALLOW_MESSAGES;
        const chatHistoriesViewTemp: ChatHistories[] =
          this.chatService?.chatHistories?.slice(this.numberMessages * -1);
        this.missing = chatHistoriesViewTemp?.filter(
          (x) => !this.chatHistoriesView?.includes(x)
        );
        this.missing = this.missing?.reverse();
        if (this.missing?.length !== 0) {
          for (let i = 0; i < ALLOW_MESSAGES; i++) {
            console.log('missing', this.missing);
            if (typeof this.missing[i] !== 'undefined') {
              this.chatHistoriesView?.push(this.missing[i]);
            }
          }
        }
      }
      event.target.complete();
    }, 1000);
  }

  // ---
  // PUBLIC METHODS.
  // ---

  ngAfterViewInit(): void {
    // for (let i = 0; i <= 20; i++) {
    //   this.addNewsItem();
    // }
  }

  // ---
  // PRIVATE METHODS.
  // ---

  // I add a new news item, using the abstracted DOM manipulation methods.
  private async addNewsItem(): Promise<void> {
    // NOTE: Depending on the type of demo, the constrained container is different.
    // And, the different containers use slightly different DOM methods for getting
    // and setting the current scroll heights and offsets. As such, the getters and
    // setters have been abstracted into other private methods. That said, the
    // algorithm is the same in both cases:
    // --
    // STEP 1: Get current scroll conditions.
    // STEP 2: Add new content and force DOM reconciliation.
    // STEP 3: Check new scroll conditions.
    // STEP 4: Update scroll settings to account for new content.
    // --

    // STEP ONE: Get the current scroll conditions for the container.
    var preScrollHeight = this.ScrollHeight;
    var preScrollOffset = this.scroll;

    // STEP TWO: Add the content that will change the scroll-height of the container.
    this.numberMessages = this.numberMessages + ALLOW_MESSAGES;
    const chatHistoriesViewTemp: ChatHistories[] =
      this.chatService?.chatHistories?.slice(this.numberMessages * -1);
    this.missing = chatHistoriesViewTemp?.filter(
      (x) => !this.chatHistoriesView?.includes(x)
    );
    if (this.missing?.length !== 0) {
      this.missing = this.missing.reverse();
      for (let i = 0; i < ALLOW_MESSAGES; i++) {
        console.log('missing', this.missing);
        if (typeof this.missing[i] !== 'undefined') {
          this.chatHistoriesView?.unshift(this.missing[i]);
        }
      }
    }

    // Force Angular to reconcile the DOM with the View Model. This call tells
    // Angular to trigger a change-detection so that our new news item will be
    // rendered to the browser, allowing us to inspect the scroll changes.
    this.changeDetectionRef.detectChanges();

    // STEP THREE: Now that Angular has rendered the changes in the browser, we have
    // to examine the state of the browser to see how the changes were handled.
    var postScrollOffset = this.ScrollHeight;

    // In modern Chrome and Firefox, the scroll-offset will be HANDLED AUTOMATICALLY.
    // Meaning, Chrome and Firefox will UPDATE THE SCROLL OFFSET in order to maintain
    // the "current" experience for the user (how great is that?!?!). However, Safari
    // does not do this. As such, if the pre/post scroll offsets are the same, we
    // have to step-in and manually SCROLL THE USER DOWN to compensate for the change
    // in document height.
//     if (
//       preScrollOffset &&
//       postScrollOffset &&
//       preScrollOffset === await postScrollOffset // The browser did NOT help us.
//  // The browser did NOT help us.
//     ) {
//       // STEP FOUR: The browser didn't adjust the scroll offset automatically. As
//       // such, we have to step in and scroll the user down imperatively.
//       var postScrollHeight = await this.getContainerScrollHeight();
//       var deltaHeight = postScrollHeight - preScrollHeight;

//       this.setScrollTop(await postScrollOffset, deltaHeight);

//       console.warn('Scrolling by', deltaHeight, 'px');
//     }
  }

  // I get the current scroll height of the container.
  private async getContainerScrollHeight(): Promise<number> {
    return (await this.content.getScrollElement()).scrollHeight;
  }

  // I get the current scroll offset of the container.
  private async getContainerScrollTop(): Promise<number> {
    return (await this.content.getScrollElement()).scrollTop;
  }


  // I update the container to use the new scroll offset.
  // private setScrollTop(currentScrollTop: number, delta: number): void {
  //   this.viewportRef.nativeElement.scrollTop = currentScrollTop + delta;

  //   window.scrollBy(0, delta);
  // }

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
