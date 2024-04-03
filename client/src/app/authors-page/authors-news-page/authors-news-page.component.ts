import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {NewsServices} from "../../shared/services/news.services";
import {AuthorsServices} from "../../shared/services/authors.services";
import {Observable} from "rxjs";
import {News} from "../../shared/interfaces";
import {LoaderComponent} from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-authors-news-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    RouterLink,
    NgIf,
    LoaderComponent
  ],
  templateUrl: './authors-news-page.component.html',
  styleUrl: './authors-news-page.component.css'
})
export class AuthorsNewsPageComponent implements OnInit {
  news$!: Observable<News[]>
  constructor(
    private newsService: NewsServices,
    private authorService: AuthorsServices,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id']
        this.news$ = this.authorService.getNewsByAuthor(id)
    });
  }
}
