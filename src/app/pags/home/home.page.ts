import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/classes/article';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public title: string = "Home";

  constructor(private articleService: ArticleService) { }

  ngOnInit() {
  }
}
