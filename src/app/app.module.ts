import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HorizontalLayoutComponent } from './tree-chart/horizontal-layout/horizontal-layout.component';
import { VerticalLayoutComponent } from './tree-chart/vertical-layout/vertical-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HorizontalLayoutComponent,
    VerticalLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
