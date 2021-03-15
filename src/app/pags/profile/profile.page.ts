import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/classes/user';
import { AlertService } from 'src/app/services/alert.service';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public title: string = "Loading profile";
  public user: User = new User();
  public id: string = null;
  private alertLoading: string;
  private subscription1: Subscription;
  private subscription2: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private router: Router, private alertService: AlertService, private imageService: ImageService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUser();
  }

  ionViewWillLeave() {
    this.user = new User();
    this.id = null;
    this.title = "Loading profile";
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
  }

  async getUser() {
    await this.alertService.presentLoading().then(ans => this.alertLoading = ans);
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id)
      this.getUserProfile(this.id);
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = this.userService.auth.user.subscribe(async ans => {
      if (ans)
        await this.verifyLoggedUser(ans.uid);
      else if (!this.id && !ans)
        await this.redirectToLogin();
      await this.alertService.dismissLoading(this.alertLoading)
    });
  }

  getUserProfile(id: string) {
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    this.subscription2 = this.userService.get(id).subscribe(ans => {
      if (!ans) {
        this.router.navigate(["/"]);
        return;
      }
      this.user.email = ans.email;
      this.user.name = ans.name;
      this.user.photo = ans.photo;
      this.user.userType = ans.userType;
      //for context, just using "this.user = ans" would "work", but it'd overwrite the user.id being set elsewhere
      this.title = this.user.name + "'s profile";
    }); //maybe I should rethink this logic, like using the user.id for the activatedRoute's id and deleting the id completely?
  }

  async verifyLoggedUser(id: string) {
    if (!this.id)
      this.getUserProfile(id);
    this.user.id = id;
  }

  async redirectToLogin() {
    this.router.navigate(["/login"]);
  }

  //todo add alterPhoto() function and check if user is logged in and the profile shown is the same as the user's profile, otherwise if u log out while being in this page it would go through with the alteration (try using unsubscribe)
  async alterPhoto() {
    await this.imageService.alterPhoto().then(async (returnedPhoto) => {//todo add verification for to check if result is png, jpeg, gif or other img files
      await this.alertService.presentLoading().then(ans => this.alertLoading = ans);
      if (returnedPhoto) {
        this.user.photo = returnedPhoto;
        await this.userService.updatePhoto(this.user.id, returnedPhoto).then(() => { }, async err => {
          console.log(err);
          await this.alertService.presentAlert("Ops!", "It seems your image is too big");
        });
        await this.alertService.dismissLoading(this.alertLoading);
      } else {
        this.alertService.presentAlert("Error", "Image couldn't be processed");
        await this.alertService.dismissLoading(this.alertLoading);
      }
    });
  }
}
