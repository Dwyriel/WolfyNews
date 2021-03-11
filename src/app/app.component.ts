import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Articles', url: '1', icon: 'newspaper' },
    { title: 'About', url: '2', icon: 'help-circle' },
  ];
  constructor() {}
}
