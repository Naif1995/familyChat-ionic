/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';

const TOKEN_KEY = 'auth-token';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);

  constructor(
    private storage: StorageService,
    private plt: Platform,
    private navCtrl: NavController,
    public alertController: AlertController
    ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }
  isAuthenticated() {
    if (!this.authenticationState.value) {
      this.navCtrl.navigateBack(['login'])
    }
    return this.authenticationState.value;
  }
}
