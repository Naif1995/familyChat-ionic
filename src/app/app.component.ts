import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { delay, map, take } from 'rxjs/operators';
import { AuthenticationService } from './auth/services/authentication.service';
import { StorageService } from './auth/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private plt: Platform,
    private storage: StorageService
  ) {
    this.storage.init();
  }
  ngOnInit() {
  }

  onLogout() {}
}
