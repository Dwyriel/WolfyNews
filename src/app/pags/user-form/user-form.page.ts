import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularDelegate } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { User, UserType } from 'src/app/classes/user';
import { AlertService } from 'src/app/services/alert.service';
import { EmailValidationService } from 'src/app/services/email-validation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.page.html',
  styleUrls: ['./user-form.page.scss'],
})
export class UserFormPage implements OnInit {
  public logged: boolean = false;
  public user: User = new User;
  public title: string = "Account";
  public minlength: number = 6;
  private loadingAlert: string;
  private subscription1: Subscription;
  private subscription2: Subscription;

  public confirm = "";//form would not work properly without the ngModel pointing to some var

  constructor(private userService: UserService, public emailValidation: EmailValidationService, private alertService: AlertService, private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.checkIfLogged();
  }

  ionViewWillLeave() {
    this.user = new User();
    this.logged = false;
    this.confirm = null;
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
  }

  async checkIfLogged() {
    await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans; });
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = this.userService.auth.user.subscribe(async ans => {//will always return an ans, even if not logged in, but ans will be null
      if (!ans) {
        this.logged = false;
        this.user = new User();
        this.confirm = null;
        this.user.userType = UserType.User;
        this.title = "New Account";
        await this.alertService.dismissLoading(this.loadingAlert)
        return;
      }
      if (this.subscription2 && !this.subscription2.closed)
        this.subscription2.unsubscribe();
      this.subscription2 = this.userService.get(ans.uid).subscribe(data => { this.user = data; this.user.id = ans.uid;});
      this.logged = true;
      await this.alertService.dismissLoading(this.loadingAlert)
    });
  }

  async OnFormSubmit(form: NgForm) {
    if (form.valid) {
      await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans; });
      if (!this.logged)
        await this.userService.addUser(this.user).then(
          ans => {
            form.reset;
            this.successfulSubmit("Job's done!", "User was registered.", "");
          }, err => {
            this.failedSubmit("Error occurred", "User was not registered.", err)
          });
      else {
        this.userService.update(this.user).then(
          ans =>{
            form.reset();
            this.successfulSubmit("Updated!", "Your profile was updated.", "/profile");
          }, err => {
            this.failedSubmit("Error occurred", "Your profile was not updated.", err);
          });
      }
    }
  }

  successfulSubmit(title: string, description: string, navigateTo: string) {
    this.user = new User();
    this.logged = false;
    this.alertService.presentAlert(title, description);
    setTimeout(() => this.alertService.dismissLoading(this.loadingAlert), 200);
    setTimeout(() => this.router.navigate([navigateTo]), 300);
  }

  failedSubmit(title: string, description: string, err) {
    console.log(err);
    this.alertService.presentAlert(title, description);
    setTimeout(() => this.alertService.dismissLoading(this.loadingAlert), 200);
  }
}
