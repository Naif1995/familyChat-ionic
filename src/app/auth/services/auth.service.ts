/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState = new BehaviorSubject(true);

  constructor() {}


  // ifLoggedIn() {
  //   this.storage.get('USER_INFO').then((response) => {
  //     if (response) {
  //       this.authState.next(true);
  //     }
  //   });
  // }


  // login() {
  //   const dummy_response = {
  //     user_id: '007',
  //     user_name: 'test'
  //   };
  //   this.storage.set('USER_INFO', dummy_response).then((response) => {
  //     this.router.navigate(['chats']);
  //     this.authState.next(true);
  //   });
  // }

  // logout() {
  //   this.storage.remove('USER_INFO').then(() => {
  //     this.router.navigate(['login']);
  //     this.authState.next(false);
  //   });
  // }

  isAuthenticated() {
    console.log(this.authState.value);
    return this.authState.value;
  }
}
