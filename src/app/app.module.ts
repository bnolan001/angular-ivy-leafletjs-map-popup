import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CustomPopupComponent } from './custom-popup/custom-popup.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, MapComponent, CustomPopupComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
