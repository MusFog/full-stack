import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {CategoryListComponent} from "../news-search-page/category-list/category-list.component";
import {LoaderComponent} from "../shared/components/loader/loader.component";
import {Category, News} from "../shared/interfaces";
import {BehaviorSubject, combineLatest, map, Observable, startWith, switchMap} from "rxjs";
import {NewsServices} from "../shared/services/news.services";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CategoryAllListComponent} from "./category-all-list/category-all-list.component";

@Component({
  selector: 'app-category-all-page',
  standalone: true,
  imports: [
    AsyncPipe,
    CategoryListComponent,
    LoaderComponent,
    NgForOf,
    NgIf,
    NgClass,
    RouterLink,
    CategoryAllListComponent
  ],
  templateUrl: './category-all-page.component.html',
  styleUrl: './category-all-page.component.css'
})
export class CategoryAllPageComponent implements OnInit {
  categories: Category[] = []
  filter$ = new BehaviorSubject<string>('')
  constructor(private newsService: NewsServices, private route: ActivatedRoute) {
  }
  news$!: Observable<News[]>
  ngOnInit() {
    this.news$ = combineLatest([
      this.route.params.pipe(
        map(params => params['id']),
        switchMap(id => id ? this.newsService.fetchByCategoryId(id.split(',')) : this.newsService.fetch())
      ),
      this.filter$.pipe(startWith(''))
    ]).pipe(
      map(([news, filterString]) => news.filter(newsItem => newsItem.name.toLowerCase().includes(filterString.toLowerCase())))
    )
  }



  onCategoriesSelected(categoryId: string | null) {
    if (categoryId) {
      this.news$ = this.newsService.fetchByCategoryId(categoryId).pipe(
        map(news => news.filter(newsItem =>
          newsItem.name.toLowerCase().includes(this.filter$.getValue().toLowerCase())
        ))
      )
    } else {
      this.news$ = this.newsService.fetch().pipe(
        map(news => news.filter(newsItem =>
          newsItem.name.toLowerCase().includes(this.filter$.getValue().toLowerCase())
        ))
      )
    }
  }
}
