import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  public firebaseAns: boolean; //it's bad to do what I did with the auth answer, so changing this to boolean
  private subscription1: Subscription;

  constructor(private userService: UserService, private alertService: AlertService, private router: Router) { }

  async ngOnInit() {
    await this.verifyUser();
  }

  async verifyUser() {
    this.userService.auth.user.subscribe( //should probably leave this subscrition active all the time
      ans => {
        if (ans) {
        this.firebaseAns = true;
        this.subscription1 = this.userService.get(ans.uid).subscribe(ans => this.user = ans);
          return;
        }
        this.firebaseAns = false;
        this.user = null;
      },
      err => {
        this.user = null;
        console.log(err);
      });
  }

  async logout() {
    await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans });
    await this.userService.auth.signOut().then(async () => {
      await this.alertService.dismissLoading(this.loadingAlert);
      this.user = null;
      if (this.subscription1 && !this.subscription1.closed)
        this.subscription1.unsubscribe();
      //this.router.navigate(["/login"]);//maybe i can remove this again?
    });
  }
}
