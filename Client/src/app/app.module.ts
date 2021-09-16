import {DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from 'src/shared/modules/material.module';
import { SharedModule } from 'src/shared/modules/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from "@angular/common/http";
import {CommonModule, registerLocaleData} from "@angular/common";
import {MatCommonModule, MatOptionModule} from "@angular/material/core";
import {interceptors} from "../shared/interceptors/interceptors.const";
import {MatTableModule} from "@angular/material/table";
import {LocaleService} from "../shared/services/locale.service";
import localeHe from '@angular/common/locales/he';
import { HomeTableComponent } from './home/components/home-table/home-table.component';
registerLocaleData(localeHe)

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainLayoutComponent,
    LoginComponent,
    HomeTableComponent,
  ],
  imports: [
    CommonModule,
    MatCommonModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    HttpClientModule,
  ],
  providers: [
    ...interceptors,
    {
      provide: LOCALE_ID,
      useFactory: (localeService: LocaleService) => {
        console.log('locale ID', localeService.language);
        return localeService.language;
      },
      deps: [LocaleService]
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useFactory: (localeService: LocaleService) => {
        console.log('locale ID', localeService.currency);
        return localeService.currency;
      },
      deps: [LocaleService]
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
