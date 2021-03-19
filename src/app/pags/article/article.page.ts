import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/classes/article';
import { User } from 'src/app/classes/user';
import { UserComment } from 'src/app/classes/user-comment';
import { AlertService } from 'src/app/services/alert.service';
import { ArticleService } from 'src/app/services/article.service';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.page.html',
  styleUrls: ['./article.page.scss'],
})
export class ArticlePage implements OnInit {
  public title: string = "Loading";
  public article: Article = new Article();
  private id: string;
  private loadingAlert: string;
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  private subscription4: Subscription;
  private subscription5: Subscription;
  private loggedUser: User = null;
  private newComment: UserComment = new UserComment();
  public firebaseAns: boolean;
  public comment: string = "";
  public commenting: boolean = false;
  public comments: UserComment[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private articleService: ArticleService, private userService: UserService, private alertService: AlertService, private commentService: CommentService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.getArticle();
    await this.getComments();
    await this.verifyUser();
  }

  async ionViewWillLeave() {
    this.title = "Loading";
    this.article = new Article();
    this.id = null;
    this.comment = "";
    this.commenting = false;
    this.loggedUser = null;
    this.newComment = new UserComment();
    this.comments = [];
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    if (this.subscription4 && !this.subscription4.closed)
      this.subscription4.unsubscribe();
    if (this.subscription5 && !this.subscription5.closed)
      this.subscription5.unsubscribe();
  }

  async getArticle() {
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (!this.id) {
      this.router.navigate(["/"]);
      return;
    }
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = this.articleService.get(this.id).subscribe(async ans => {
      if (!ans.active) {
        this.router.navigate(["/"]);
        return;
      }
      this.article = ans;
      this.article.date = new Date(ans.date);
      this.title = "Reading: " + this.article.title;
      if (this.subscription2 && !this.subscription2.closed)
        this.subscription2.unsubscribe();
      this.subscription2 = this.userService.get(this.article.authorId).subscribe(async ans2 => {
        this.article.author = ans2;
        await this.alertService.dismissLoading(this.loadingAlert);
      }, async err => {
        console.log(err);
        await this.alertService.dismissLoading(this.loadingAlert);
      });
    }, async err => {
      console.log(err);
      await this.alertService.dismissLoading(this.loadingAlert);
    });
  }

  async getComments() {
    if (!this.id)
      return;
    if (this.subscription5 && !this.subscription5.closed)
      this.subscription5.unsubscribe();
    this.subscription5 = this.commentService.getAllFromArticle(this.id).subscribe(ans => {
      this.comments = ans;
      this.comments.forEach(value => {
        var subscription = this.userService.get(value.userId).subscribe(ans2 => {
          value.user = ans2;
          subscription.unsubscribe();
        })
      })
    })
  }

  async verifyUser() {
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.subscription3 = this.userService.auth.user.subscribe( //should probably leave this subscrition active all the time
      ans => {
        if (ans) {
          this.firebaseAns = true;
          if (this.subscription4 && !this.subscription4.closed)
            this.subscription4.unsubscribe();
          this.subscription4 = this.userService.get(ans.uid).subscribe(ans2 => { this.loggedUser = ans2; this.loggedUser.id = ans.uid; });
          return;
        }
        this.firebaseAns = false;
        this.loggedUser = null;
      },
      err => {
        this.loggedUser = null;
        console.log(err);
      });
  }

  async submitButton() {
    if (!this.loggedUser) {
      await this.alertService.presentAlert("Oops!", "Seems like you're not logged or an internal error occurred, reload and try again.");
      return;
    }
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans);
    this.newComment.text = this.comment;
    this.newComment.userId = this.loggedUser.id;
    await this.commentService.add(this.newComment, this.id).then(async ans => {
      this.newComment = new UserComment();
      this.chanceCommenting();
      this.comment = "";
      await this.alertService.dismissLoading(this.loadingAlert);
      await this.alertService.ShowToast("Yayy. Comment sent.");
    }, async err => {
      console.log(err)
      await this.alertService.ShowToast("Oops. Could not send comment.");
    });
  }

  cancelButton() {
    this.comment = "";
    this.chanceCommenting();
  }

  chanceCommenting() {
    this.commenting = !this.commenting;
  }
}
