import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/classes/article';
import { AlertService } from 'src/app/services/alert.service';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.page.html',
  styleUrls: ['./articles.page.scss'],
})
export class ArticlesPage implements OnInit {
  public articles: Article[] = [];
  public numOfTimes: number = 5;
  private loadingAlert: string;
  private subscription1: Subscription;

  constructor(private articleService: ArticleService, private alertService: AlertService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getArticles();
  }

  ionViewWillLeave() {
    this.articles = []
    this.numOfTimes = 5;
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
  }

  async getArticles() {
    if (this.subscription1 && !this.subscription1.closed)
      this.subscription1.unsubscribe();
    await this.alertService.presentLoading().then(ans => this.loadingAlert = ans)
    this.subscription1 = this.articleService.getAllActive().subscribe(async ans => {
      this.articles = ans;
      await this.alertService.dismissLoading(this.loadingAlert);
    }, async err => {
      await this.alertService.dismissLoading(this.loadingAlert);
      console.log(err);
    });
  }

  get sortByDate() {
    return this.articles.sort((a, b) => {
      return <any>b.date - <any>a.date;
    });
  }

  loadMore() {
    this.numOfTimes += 3;
  }
}
