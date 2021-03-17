import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/classes/article';
import { User, UserType } from 'src/app/classes/user';
import { AlertService } from 'src/app/services/alert.service';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.page.html',
  styleUrls: ['./article-form.page.scss'],
})
export class ArticleFormPage implements OnInit {

  public article: Article = new Article();
  private user: User;
  private loadingAlert: string;
  private id: string;
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  public title: string = "Article";

  constructor(private alertService: AlertService, private articleService: ArticleService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.checkIfLogged();
    await this.checkForArticle();
  }

  ionViewWillLeave() {
    this.article = new Article();
    this.user = null;
    this.title = "Article";
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
  }

  async checkIfLogged() {
    await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans; });
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = this.userService.auth.user.subscribe(async ans => {
      if (!ans) {
        this.router.navigate(["/"]);
        await this.alertService.dismissLoading(this.loadingAlert);
        return;
      }
      if (this.subscription2 && !this.subscription2.closed)
        this.subscription2.unsubscribe();
      this.subscription2 = this.userService.get(ans.uid).subscribe(
        data => {
          this.user = data;
          this.user.id = ans.uid;
          if ((this.user.userType != UserType.Admin && this.user.userType != UserType.Editor) || !this.user)
            this.router.navigate(["/"]);
        });
    });
  }

  async checkForArticle() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      if (this.subscription3 && !this.subscription3.closed)
        this.subscription3.unsubscribe();
      this.subscription3 = this.articleService.get(this.id).subscribe(async ans => {
        this.article = ans;
        this.article.id = this.id;
        await this.alertService.dismissLoading(this.loadingAlert);
      });
    } else {
      this.title = "New Article";
      await this.alertService.dismissLoading(this.loadingAlert);
    }
  }

  async OnFormSubmit(form: NgForm) {
    if (form.valid) {
      await this.alertService.presentLoading().then(ans => { this.loadingAlert = ans; });
      if (this.id) {
        if (this.subscription3 && !this.subscription3.closed)
          this.subscription3.unsubscribe();
        this.articleService.update(this.article).then(async () => {
          form.reset;
          await this.successfulSubmit("Job's done!", "Article was updated.", "article/" + this.article.id);
        }, async err => {
          await this.failedSubmit("Error occurred", "Article was not updated.", err);
        });
      } else {
        this.article.date = new Date();
        this.article.authorId = this.user.id;
        this.article.active = true;
        this.articleService.add(this.article).then(async ans => {
          form.reset;
          await this.successfulSubmit("Job's done!", "Article was published.", "article/" + ans.id);
        }, async err => {
          await this.failedSubmit("Error occurred", "Article was not published.", err);
        });
      }
    }
  }

  async successfulSubmit(title: string, description: string, navigateTo: string) {
    this.user = null;
    this.article = new Article();
    await this.alertService.dismissLoading(this.loadingAlert);
    await this.alertService.presentAlert(title, description);
    await this.router.navigate([navigateTo]);
  }

  async failedSubmit(title: string, description: string, err) {
    console.log(err);
    await this.alertService.dismissLoading(this.loadingAlert);
    await this.alertService.presentAlert(title, description);
  }
}
