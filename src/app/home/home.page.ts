import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  chats= [
    { id:'c1',
  describtion:'Chat 1',
  title:'chat 1',
  imageUrl:'https://thumbs.dreamstime.com/z/gorgeous-frangipani-flowers-6647154.jpg'
}
];
  loginForm: FormGroup;
  socialUser: SocialUser;
  isLoggedin: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService
  ) { }
  ngOnInit() {
    this.loginForm =
    this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    }
    );


    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = (user != null);
      console.log(this.socialUser);
    });
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    this.socialAuthService.signOut();
  }

}
