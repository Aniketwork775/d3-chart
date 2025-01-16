import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorizontalLayoutComponent } from './tree-chart/horizontal-layout/horizontal-layout.component';
import { VerticalLayoutComponent } from './tree-chart/vertical-layout/vertical-layout.component';
import { CircleLayoutComponent } from './tree-chart/circle-layout/circle-layout.component';
import { RadialLayoutComponent } from './tree-chart/radial-layout/radial-layout.component';

const routes: Routes = [
  {
    path:"",component:VerticalLayoutComponent
  },
  {
    path:'layout',component:HorizontalLayoutComponent
  },
  {
    path:'circle',component:CircleLayoutComponent
  },
  {
    path:'radial',component:RadialLayoutComponent
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
