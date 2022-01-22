/* eslint-disable @angular-eslint/contextual-lifecycle */
import { Injectable, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { BehaviorSubject, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { User } from './user.module';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnInit {
  public authenticationState = new BehaviorSubject<User>(null);
  constructor(
    private storage: StorageService,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    console.log('ngOnInit AuthenticationService');
    this.storage.init();
  }

  setToken(token: string): Promise<string> {
    this.storage.set(TOKEN_KEY, token);
    return new Promise((resolve, reject) => {
      resolve(this.storage.get(TOKEN_KEY));
    });
  }

  setUserData(name: string, id: string, token: string) {
    const user: User = {
      name,
      id,
      token,
    };
    this.storage.set(TOKEN_KEY, user);
  }

  getUserData(): Promise<User> {
    return  this.storage.get(TOKEN_KEY);
    }

  isAuthenticated(): Promise<boolean> {
    return from(this.storage.get(TOKEN_KEY))
      .pipe(
        map((user: User) => {
          if (user) {
            return true;
          }
          return false;
        })
      )
      .toPromise();
  }
}
