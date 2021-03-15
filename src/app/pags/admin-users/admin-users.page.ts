import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User, UserType } from 'src/app/classes/user';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
})
export class AdminUsersPage implements OnInit {
  public users: User[] = [];
  private loadingAlert: string;
  private loadingAlert2: string;
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private loggedUser: User;
  constructor(private userService: UserService, private alertService: AlertService, private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.verifyUser();
    this.load();
  }

  ionViewWillLeave() {
    this.users = [];
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
  }

  async verifyUser() {
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = this.userService.auth.user.subscribe(ans => {//will always return an ans, even if not logged in, but ans will be null
      if (!ans) {
        this.router.navigate(["/"]);
        return;
      }
      if (this.subscription3 && !this.subscription3.closed)
        this.subscription3.unsubscribe();
      this.subscription3 = this.userService.get(ans.uid).subscribe(
        ans => {
          this.loggedUser = ans;
          if (this.loggedUser.userType != UserType.Admin)
            this.router.navigate(["/"]);
        });
    });
  }

  async load(event?) {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans });
    this.subscription1 = this.userService.getAll().subscribe(async ans => {
      this.users = ans;
      if (event)
        event.target.complete();
      await this.alertService.dismissLoading(this.loadingAlert);//will give a lot of errors but will still work properly
    });
  }

  async changeUser(id, name: string) {
    await this.alertService.changeUserType().then(async data => {
      if (data === UserType.Admin || data) {//cuz admin has a 0 value, just using if(data) would be false for admin
        await this.alertService.presentLoading().then(ans => { this.loadingAlert2 = ans });
        await this.userService.updateType(id, data).then(
          async ans => {
            await this.alertService.dismissLoading(this.loadingAlert2);
            await this.alertService.ShowToast(name + " was updated to " + ((data === UserType.Admin) ? "Admin" : (data === UserType.Editor) ? "Editor" : "User"), 3000);
          }, async err => {
            await this.alertService.dismissLoading(this.loadingAlert2);
            await this.alertService.ShowToast("An error occurred", 3000);
            console.log(err);
          }
        );
      }
    });
  }

}
