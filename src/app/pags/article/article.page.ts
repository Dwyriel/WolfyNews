import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/classes/article';
import { ArticleService } from 'src/app/services/article.service';
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
  private subscription1: Subscription;
  private subscription2: Subscription;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private articleService: ArticleService, private userService: UserService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.getArticle();
  }

  async ionViewWillLeave() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    if (this.subscription2 && !this.subscription2.closed)
      this.subscription2.unsubscribe();
  }

  async getArticle() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (!this.id) {
      this.router.navigate(["/"]);
      return;
    }
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    this.subscription1 = this.articleService.get(this.id).subscribe(ans => {
      if (!ans.active) {
        this.router.navigate(["/"]);
        return;
      }
      this.article = ans;
      this.article.date = new Date(ans.date);
      this.title = "Reading: " + this.article.title;
      if (this.subscription2 && !this.subscription2.closed)
        this.subscription2.unsubscribe();
      this.subscription2 = this.userService.get(this.article.authorId).subscribe(ans2 => {
        this.article.author = ans2;
      })
    })
  }
}
