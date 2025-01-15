import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HorizontalLayoutComponent } from './tree-chart/horizontal-layout/horizontal-layout.component';
import { VerticalLayoutComponent } from './tree-chart/vertical-layout/vertical-layout.component';
import { HeaderComponent } from './header/header.component';
import { CircleLayoutComponent } from './tree-chart/circle-layout/circle-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HorizontalLayoutComponent,
    VerticalLayoutComponent,
    HeaderComponent,
    CircleLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
