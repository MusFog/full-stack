import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable} from "rxjs";
import {Category} from "../../shared/interfaces";
import {CategoriesServices} from "../../shared/services/categories.services";
import {RouterLink} from "@angular/router";
import {LoaderComponent} from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgForOf,
    NgIf,
    RouterLink,
    LoaderComponent
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  categories$!: Observable<Category[]>
  selectedCategoryIds: string[] = []

  @Output() categoriesSelected = new EventEmitter<string[]>()

  constructor(private categoriesService: CategoriesServices) {}

  ngOnInit() {
    this.categories$ = this.categoriesService.fetch()
  }

  isSelected(categoryId: string): boolean {
    return this.selectedCategoryIds.includes(categoryId)
  }

  onCategorySelect(categoryId: string): void {
    const index = this.selectedCategoryIds.indexOf(categoryId)
    if (index === -1) {
      this.selectedCategoryIds.push(categoryId)
    } else {
      this.selectedCategoryIds.splice(index, 1)
    }
    this.onSubmit()
  }
  onSubmit() {
    this.categoriesSelected.emit(this.selectedCategoryIds)
  }
}

