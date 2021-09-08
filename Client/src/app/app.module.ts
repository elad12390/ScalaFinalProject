import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from 'src/shared/modules/material.module';
import { SharedModule } from 'src/shared/modules/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { MatCommonModule } from "@angular/material/core";
import {interceptors} from "../shared/interceptors/interceptors.const";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainLayoutComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    MatCommonModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [...interceptors],
  bootstrap: [AppComponent]
})
export class AppModule { }
