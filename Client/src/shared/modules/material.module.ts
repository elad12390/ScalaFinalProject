import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {MatInputModule} from '@angular/material/input';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
	exports: [
		BrowserModule,
		MatInputModule,
		LayoutModule,
		MatToolbarModule,
    MatIconModule,
    MatButtonModule
	]
})
export class MaterialModule { }
