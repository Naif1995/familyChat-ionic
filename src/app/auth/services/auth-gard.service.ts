import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  CanLoad,
  Route,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Storage } from '@capacitor/storage';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthenticationService) {}

  canActivate(): boolean {
    return true;
    //return this.auth.isAuthenticated();
  }

}
