import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { delay } from 'rxjs/operators';
import { AuthenticationService } from '../auth/services/authentication.service';

const TOKEN_KEY = 'auth-token';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  chats = [
    {
      id: 'c1',
      describtion: 'Chat 1',
      title: 'chat 1',
      imageUrl:
        'https://thumbs.dreamstime.com/z/gorgeous-frangipani-flowers-6647154.jpg',
    },
  ];
  isAuthenticated = null;
  constructor(
    private router: Router,
    private authService: AuthenticationService  ) {}

  ngOnInit() {
  }


}
