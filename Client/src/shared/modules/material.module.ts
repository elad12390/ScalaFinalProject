import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {MatInputModule} from '@angular/material/input';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';


@NgModule({
	exports: [
		BrowserModule,
		MatInputModule,
		LayoutModule,
		MatToolbarModule
	]
})
export class MaterialModule { }