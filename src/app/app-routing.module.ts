import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth/services/auth-gard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'chats',
    loadChildren: () =>
      import('./chats/chats.module').then((m) => m.ChatsPageModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthPageModule),
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
