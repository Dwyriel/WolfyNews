import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.page.html',
  styleUrls: ['./error-page.page.scss'],
})
export class ErrorPagePage implements OnInit {
  public title:string = "The Void";
  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToHome(){
    this.router.navigate(["/"]);
  }
}
