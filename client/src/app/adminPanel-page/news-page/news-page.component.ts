import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {RouterLink} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {Observable} from "rxjs";
import {Category} from "../../shared/interfaces";
import {CategoriesServices} from "../../shared/services/categories.services";

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [
    AsyncPipe,
    LoaderComponent,
    NgForOf,
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './news-page.component.html',
  styleUrl: './news-page.component.css'
})
export class NewsPageComponent implements OnInit {
  categories$!: Observable<Category[]>
  constructor(private categoriesService: CategoriesServices) {
  }
  ngOnInit() {
    this.categories$ = this.categoriesService.fetch()
  }
}
