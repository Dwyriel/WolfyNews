import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.page.html',
  styleUrls: ['./error-page.page.scss'],
})
export class ErrorPagePage implements OnInit {
  public title:string = "The Void";
  constructor() { }

  ngOnInit() {
  }

}
