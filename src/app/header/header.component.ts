import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentComponent:any;
  assetPath='assets'
  userType:any;
  navigation(e:any){

  }
}
