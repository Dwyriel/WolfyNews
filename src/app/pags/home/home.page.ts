import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/classes/article';
import { User } from 'src/app/classes/user';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public title: string = "Home";
  public user: User = null;
  public articles: Article[] = [];
  private subscription1: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;
  public articlesLoaded: boolean = false;
  public firebaseAns: boolean = false;

  constructor(private articleService: ArticleService, private userService: UserService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.checkIfLogged();
    this.getArticles();
  }

  ionViewWillLeave() {
    this.user = null;
    this.articles = []
    this.articlesLoaded = false;
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
  }

  async checkIfLogged() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = this.userService.auth.user.subscribe(
      ans => {
        if (ans) {
          this.firebaseAns = true;
          if (this.subscription2 && !this.subscription2.closed)
            this.subscription2.unsubscribe();
          this.subscription2 = this.userService.get(ans.uid).subscribe(ans => this.user = ans);
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

  async getArticles() {
    if (this.subscription3 && !this.subscription3.closed)
      this.subscription3.unsubscribe();
    this.subscription3 = this.articleService.getAllWithOptions({ limit: 3 }).subscribe(ans => {
      this.articles = ans;
      this.articlesLoaded = true;
    });
  }
}
