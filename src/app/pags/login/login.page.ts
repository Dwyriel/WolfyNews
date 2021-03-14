import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { EmailValidationService } from 'src/app/services/email-validation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email: string = "";
  public password: string = "";

  constructor(private userService: UserService, private router: Router, public emailValidation: EmailValidationService, private alertService: AlertService) { }

  ngOnInit() {
    this.userService.auth.user.subscribe(ans => {
      if (ans)
        this.router.navigate(["/"]);
    });
  }

  async OnFormSubmit(form: NgForm) {
    var loadingId: string;
    await this.alertService.presentLoading().then(ans => loadingId = ans);
    await this.userService.auth.signInWithEmailAndPassword(this.email, this.password).then(
      ans => {
        this.alertService.dismissLoading(loadingId);
        form.reset();
        setTimeout(() => this.router.navigate(["/"]), 300);
      },
      err => {
        this.alertService.dismissLoading(loadingId);
        this.password = "";
        console.log("Error: ", err);
        this.alertService.presentAlert("Error", "Email or password invalid");
      });
  }
}
