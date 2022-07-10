import { Injectable } from '@angular/core';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { StorageService } from 'src/app/auth/services/storage.service';
import { BehaviorSubject, from } from 'rxjs';
import { User } from 'src/app/auth/services/user.module';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;

  constructor(private storageService: StorageService) { }

  getUserData(): Promise<User> {
  return  this.storageService.get(TOKEN_KEY);
  }

}
