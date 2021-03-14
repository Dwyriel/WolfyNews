import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './classes/user';
import { AlertService } from './services/alert.service';
import { UserService } from './services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit { //this class did not implement OnInit b4, if there're any error this may be the root of the problem even if it's only an interface
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Articles', url: '1', icon: 'newspaper' },
    { title: 'About', url: '2', icon: 'help-circle' },
  ];
  public adminAppPages = [
    { title: 'Users | Admin', url: '/admin_users', icon: 'people' },
  ];
  public user: User = null;
  private loadingAlert: string;
  public firebaseAns;
  constructor(private userService: UserService, private alertService: AlertService, private router: Router) { }

  async ngOnInit() {
    await this.verifyUser();
  }

  async verifyUser() {
    await this.userService.auth.user.subscribe(ans => {
      this.firebaseAns = ans;//without this it'd STILL show the previously logged user even after loging out and setting user to be null with a delay
      if (ans) {
        this.userService.get(ans.uid).subscribe(ans => this.user = ans);
        return;
      }
      this.user = null;
    },
      err => {
        this.user = null;
      });
  }

  async logout() {
    await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans });
    await this.userService.auth.signOut().then(() => {
      this.alertService.dismissLoading(this.loadingAlert);
      this.user = null;
    });
  }
}
