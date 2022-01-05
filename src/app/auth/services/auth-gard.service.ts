import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log(route);
    const authInfo = {
      authenticated: false
    };
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
