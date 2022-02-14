/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatNativeDateModule} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AutosizeModule } from 'ngx-autosize';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import {ScrollingModule} from '@angular/cdk/scrolling';

// import { StorageService } from 'ngx-webstorage-service';

// import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule,     IonicStorageModule.forRoot(), BrowserAnimationsModule
  ,MatNativeDateModule, CommonModule, HttpClientModule,AutosizeModule, ScrollingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    Vibration, ScrollingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
