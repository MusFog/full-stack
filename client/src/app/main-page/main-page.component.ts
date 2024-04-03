import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "../shared/components/loader/loader.component";
import {RouterLink} from "@angular/router";
import {News} from "../shared/interfaces";
import {NewsServices} from "../shared/services/news.services";
import {Subscription, take} from "rxjs";

const STEP = 5
@Component({
  selector: 'app-main-page',
  standalone: true,
    imports: [
        AsyncPipe,
        LoaderComponent,
        NgForOf,
        NgIf,
        RouterLink
    ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit, OnDestroy {
  news: News[] = []
  offset = 0
  limit = STEP
  allDataLoaded = false
  loading = false
  Sub!: Subscription
  constructor(
    private newsService: NewsServices,
  ) {}
  ngOnInit() {
    this.loadInitialNews()
  }

  loadInitialNews() {
    this.loading = true
    this.Sub = this.newsService.getCache().pipe(take(1)).subscribe(allNews => {
      this.news = allNews.slice(0, this.limit)
      this.offset = this.limit
      this.loading = false
      this.checkIfAllDataLoaded(allNews)
    })
  }

  loadMore() {
    this.loading = true
    this.Sub = this.newsService.getCache().pipe(take(1)).subscribe(allNews => {
      const nextNews = allNews.slice(this.offset, this.offset + this.limit)
      this.news = [...this.news, ...nextNews]
      this.offset += this.limit
      this.loading = false
      this.checkIfAllDataLoaded(allNews)
    })
  }

  private checkIfAllDataLoaded(allNews: News[]) {
    if (this.news.length >= allNews.length) {
      this.allDataLoaded = true
    }
  }
  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }
}
