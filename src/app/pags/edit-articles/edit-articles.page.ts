import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/classes/article';
import { User, UserType } from 'src/app/classes/user';
import { AlertService } from 'src/app/services/alert.service';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-articles',
  templateUrl: './edit-articles.page.html',
  styleUrls: ['./edit-articles.page.scss'],
})
export class EditArticlesPage implements OnInit {
  public articles: Article[] = [];
  private loggedUser: User;
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private loadingAlert: string;
  private loadingAlert2: string;

  constructor(private articleService: ArticleService, private alertService: AlertService, private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.verifyUser();
    this.load();
  }

  ionViewWillLeave() {
    this.loggedUser = null;
    this.articles = [];
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
  }

  async verifyUser() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = this.userService.auth.user.subscribe(ans => {
      if (!ans) {
        this.router.navigate(["/"]);
        return;
      }
      if (this.subscription2 && !this.subscription2.closed)
        this.subscription2.unsubscribe();
      this.subscription2 = this.userService.get(ans.uid).subscribe(
        ans => {
          this.loggedUser = ans;
          if (this.loggedUser.userType != UserType.Admin && this.loggedUser.userType != UserType.Editor)
            this.router.navigate(["/"]);
        });
    });
  }

  async load(event?) {
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans });
    this.subscription3 = this.articleService.getAll().subscribe(async ans => {
      this.articles = ans;
      if (event)
        await event.target.complete();
      await this.alertService.dismissLoading(this.loadingAlert);
    });
  }

  async changeActiveArticle(value: boolean, id: string, title: string) {
    await this.alertService.presentLoading().then(ans => { this.loadingAlert2 = ans });
    this.articleService.updateActive(id, !value).then(
      async () => {
        await this.alertService.dismissLoading(this.loadingAlert2);
        await this.alertService.ShowToast('"' + title + '" is now ' + ((value) ? "deactivated" : "activated"), 3000);
      }, async err => {
        await this.alertService.dismissLoading(this.loadingAlert2);
        await this.alertService.ShowToast("An error occurred", 3000);
        console.log(err);
      });
  }

  async deleteArticle(id: string, title: string) {//todo add more things after comments are implemented
    await this.alertService.confirmationAlert("Are you sure?", `You're about to delete the article "${title}". This action is permanent and can't be reversed.`).then(async ans => {
      if (ans) {
        await this.alertService.presentLoading().then(ans => { this.loadingAlert2 = ans });
        await this.articleService.delete(id).then(
          async () => {
            await this.alertService.ShowToast('"' + title + '" is no more.', 3000);
          }, async err => {
            await this.alertService.ShowToast("An error occurred", 3000);
            console.log(err);
          });
        await this.alertService.dismissLoading(this.loadingAlert2);
      }
    });
  }
  
  get sortByDate() {
    return this.articles.sort((a, b) => {
      return <any>b.date - <any>a.date;
    });
  }
}
