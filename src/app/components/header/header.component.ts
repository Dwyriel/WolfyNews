import { Component, OnInit, Input } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input("title") public title: string = "";
  @Input("segment") public segment: number;
  
  //because of the way the header works for split-content it's impossible to do it w/o the "segment" var, as iOS requires both to work properly (android would be totally fine w/o the second part)
  //this is a very poor solution but will still make life easier to implement the same header everywhere else
  
  constructor(public platform :Platform) { }

  ngOnInit() {}

}
