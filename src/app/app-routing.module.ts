import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorizontalLayoutComponent } from './tree-chart/horizontal-layout/horizontal-layout.component';
import { VerticalLayoutComponent } from './tree-chart/vertical-layout/vertical-layout.component';

const routes: Routes = [
  {
    path:"",component:VerticalLayoutComponent
  },
  {
    path:'layout',component:HorizontalLayoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    useHash: true 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
