import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Category, News} from "../shared/interfaces";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NewsServices} from "../shared/services/news.services";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MaterialInstance, MaterialService} from "../shared/classes/material.service";
import {LoaderComponent} from "../shared/components/loader/loader.component";
import {NewsPageComponent} from "../adminPanel-page/news-page/news-page.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {BehaviorSubject, combineLatest, map, Observable, of, startWith, Subscription, switchMap} from "rxjs";
import {CategoryListComponent} from "./category-list/category-list.component";

@Component({
  selector: 'app-news-search-page',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    FormsModule,
    NgClass,
    LoaderComponent,
    NewsPageComponent,
    AsyncPipe,
    RouterLink,
    CategoryListComponent
  ],
  templateUrl: './news-search-page.component.html',
  styleUrl: './news-search-page.component.css'
})
export class NewsSearchPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef!: ElementRef
  tooltip!: MaterialInstance
  categories: Category[] = []
  isFilterVisible = false
  filter$ = new BehaviorSubject<string>('')
  Sub!: Subscription
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

  onFilterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.filter$.next(filterValue)
  }


  onCategoriesSelected(categories: string[]) {
    this.Sub = combineLatest([
      this.newsService.fetchByCategoryId(categories),
      this.filter$.pipe(startWith(''))
    ]).pipe(
      map(([news, filterString]) => {
        if (!news) return []
        return news.filter(newsItem => newsItem.name.toLowerCase().includes(filterString.toLowerCase()))
      })
    ).subscribe(filteredNews => {
      this.news$ = of(filteredNews)
    })
  }
  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }

  toggleFilterVisibility() {
    this.isFilterVisible = !this.isFilterVisible
  }

  isFilteredVisible(): object {
    return {
      'active': this.isFilterVisible,
      'red': this.isFilterVisible
    }
  }
  ngOnDestroy() {
    this.tooltip.destroy?.()
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }
}
