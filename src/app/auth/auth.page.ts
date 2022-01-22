/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { HttpClient } from '@angular/common/http';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './services/authentication.service';
import { AlertService } from './services/alert.service';
import {
  AlertController,
  LoadingController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  validations_form: FormGroup;
  loading;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    public loadingCtrl: LoadingController
  ) {

  }

  ionViewDidEnter() {
    /**
     * check login state
     */
    GoogleAuth.init();
  }
  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.minLength(5),
          Validators.required,
          Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z0-9!$%@#£€*?&]+$'),
        ])
      ),
    });
  }

  validation_messages = {
    // eslint-disable-next-line quote-props
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' },
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      {
        type: 'minlength',
        message: 'Password must be at least 5 characters long.',
      },
      {
        type: 'pattern',
        message:
          'Your password must contain uppercase, lowercase, special chars and number.',
      },
    ],
  };

  onSubmitLogin(values) {
    console.log(values);
  }

  async googleLogin() {
    this.presentLoading();
    const user = await GoogleAuth.signIn()
    .catch((err) => {
      this.dismissLoading();
    });
    if (user) {
      this.dismissLoading();
      this.authService.setUserData(
        user.givenName,
        user.id,
        user.authentication.idToken
      );
      this.router.navigateByUrl('home');
    }
  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      message: 'Please wait...',
      keyboardClose: true,
      cssClass: 'spinner-loading',
      backdropDismiss: true,
      translucent: true,
    });
    this.loading.then((val) => {
      val.present();
    });
  }

  dismissLoading() {
    this.loading.then((val) => {
      val.dismiss();
    });
  }
}
