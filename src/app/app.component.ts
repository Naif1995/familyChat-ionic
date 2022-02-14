import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { delay, map, take } from 'rxjs/operators';
import { AuthenticationService } from './auth/services/authentication.service';
import { StorageService } from './auth/services/storage.service';
import { User } from './auth/services/user.module';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  user = null;
  constructor(
    private storage: StorageService,
    private authService: AuthenticationService,
    private menu: MenuController,
    public navCtrl: NavController
  ) {
    this.storage.init();
  }
  ngOnInit() {

  }

  ionWillOpen() {
    this.authService.getUserData().then((user: User) => {
      console.log('Hi');
      this.user = user;
      console.log(this.user);
    });
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  onLogout() {
    this.authService.logOut();
    this.navCtrl.navigateRoot('login');
    this.menu.close();

  }
}
