import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {MatInputModule} from '@angular/material/input';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import { FlexLayoutModule } from "@angular/flex-layout";
import {MatTableModule} from "@angular/material/table";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";


@NgModule({
	exports: [
		BrowserModule,
		MatInputModule,
		LayoutModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule,
	]
})
export class MaterialModule { }
