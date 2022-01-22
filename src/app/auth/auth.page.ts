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

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private navCtrl: NavController,
    private storage: StorageService
  ) {}

  ionViewDidEnter() {
    /**
     * check login state
     */
    this.checkLoginState();
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
    //this.authService.login(values);
    //this.router.navigate(['list']); // redirect page if login is successful
    console.log(values);
  }

  /**
   * declar - check login state
   */
  checkLoginState() {
    this.authService.authenticationState.subscribe((state) => {
      if (state) {
        // this.router.navigate(['list']);
      }
    });
  }

  async googleLogin() {
    const user = await GoogleAuth.signIn();
    if (user) {
      this.authService.setUserData(user.givenName,user.id,user.authentication.idToken);
      //  console.log(token);
      //console.log('authenticationState',this.authService.authenticationState.value);
      this.router.navigateByUrl('home');
    }
  }

  getStorgeValue() {
    const TOKEN_KEY = 'auth-token';

    this.storage.get(TOKEN_KEY).then((val) => {
      console.log(val);
    });
  }
}
