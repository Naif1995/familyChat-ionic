/* eslint-disable @typescript-eslint/semi */
/* eslint-disable arrow-body-style */
/* eslint-disable @angular-eslint/contextual-lifecycle */
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { promise } from 'protractor';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    public auth: AuthenticationService,
    private navCtrl: NavController,
    public platform: Platform
  ) {}

  canActivate(): boolean {
    console.log('auth guard');
    // return this.auth.isAuthenticated().then((val: boolean) => {
    //   if (val) {
    //     return val;
    //   }
    //   this.navCtrl.navigateRoot('login');
    //   return val;
    // });
    return true;
  }
}
