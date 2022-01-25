/* eslint-disable prefer-const */
/* eslint-disable new-parens */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivationStart, Router, RouterOutlet } from '@angular/router';
import { AlertController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { Chat } from '../chat';
import { ChatService } from '../services/chat.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChatPhotoComponent } from './chat-photo/chat-photo.component';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { User } from 'src/app/auth/services/user.module';
import { SocketService } from '../services/socket.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';


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
    private router: Router,
    private navCtrl: NavController,
    private chatService: ChatService,
    public alertController: AlertController,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private socketService: SocketService,
    private formBuilder: FormBuilder,
    private plt: Platform,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {

    this.chatForm = this.formBuilder.group({
      chatText: ['']
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('chatId')) {
        this.navCtrl.navigateBack('/chats');
        // this.outlet.deactivate();
        return;
      }
      this.chat = this.chatService.getChat(paramMap.get('chatId'));
    });
    this.authService.getUserData().then((user: User) => {
      this.user = user;
    });
    this.socketService.subscribeChat(this.chat.id);
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
    }).then(result => {
     this.loadFileData(result.files);
    },
      async (err) => {
        // Folder does not yet exists!
        await Filesystem.mkdir({
          path: IMAGE_DIR,
          directory: Directory.Data,
        });
      }
    ).then(_ => {
      loading.dismiss();
    });
  }

    // Get the actual base64 data of an image
  // base on the name of the file
  async loadFileData(fileNames: string[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });

      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
    }
  }

  sendMessage() {
    console.log(this.chatForm.get('chatText').value);
    this.socketService.sendMessage(this.chat.id);
    this.chatForm.get('chatText').reset();
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      cssClass: 'my-custom-class',
      subHeader: 'Subtitle for alert',
      message: 'This is an alert message.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  openDialog() {
    this.dialog.open(ChatPhotoComponent, {
      data: {
        imageUrl: this.chat.imageUrl,
      },
    });
  }



  async selectImage() {
    const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos // Camera, Photos or Prompt!
    });
    console.log(Image);
    if (image) {
        this.saveImage(image);
    }
}

// Create a new file from a capture image
async saveImage(photo: Photo) {
  const base64Data = await this.readAsBase64(photo);

  const fileName = new Date().getTime() + '.jpeg';
  const savedFile = await Filesystem.writeFile({
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
      directory: Directory.Data
  });
  console.log('saved: ',savedFile);

  // Reload the file list
  // Improve by only loading for the new image and unshifting array!
 // this.loadFiles();
}

  // https://ionicframework.com/docs/angular/your-first-app/3-saving-photos
  private async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
        const file = await Filesystem.readFile({
            path: photo.path
        });

        return file.data;
    }
    else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath);
        const blob = await response.blob();

        return await this.convertBlobToBase64(blob) as string;
    }
}
 // Helper function
convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader;
  reader.onerror = reject;
  reader.onload = () => {
      resolve(reader.result);
  };
  reader.readAsDataURL(blob);
});
}
