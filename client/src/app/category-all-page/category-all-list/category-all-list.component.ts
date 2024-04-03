import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import {Category, Subscriptions, CategoryResponse, Message} from '../../shared/interfaces';
import { CategoriesServices } from '../../shared/services/categories.services';
import { SubscriptionService } from '../../shared/services/subscription.services';
import {MaterialService} from "../../shared/classes/material.service";
import {Subscription} from "rxjs";

const STEP = 3

@Component({
  selector: 'app-category-all-list',
  standalone: true,
  imports: [AsyncPipe, LoaderComponent, NgForOf, NgIf],
  templateUrl: './category-all-list.component.html',
  styleUrls: ['./category-all-list.component.css'],
})
export class CategoryAllListComponent implements OnInit, OnDestroy {
  categories: Category[] = []
  selectedCategoryId: string | null = null
  offset = 0
  limit = STEP
  allDataLoaded = false
  loading = false
  Sub!: Subscription

  @Output() categorySelected = new EventEmitter<string | null>()

  constructor(private categoriesService: CategoriesServices, private subscriptionService: SubscriptionService) {}

  ngOnInit() {
    this.loadMore()
  }

  loadMore() {
    if (this.allDataLoaded) {
      return
    }
    this.loading = true
    this.Sub = this.categoriesService.fetchP({ offset: this.offset, limit: this.limit })
      .subscribe((response: CategoryResponse) => {
        this.categories = [...this.categories, ...response.data]
        this.offset += response.data.length
        this.loading = false
        if (this.offset >= response.total) {
          this.allDataLoaded = true
        }
      }, (error) => {
        MaterialService.toast(error.error.message)
        this.loading = false
      })
  }

  isSelected(categoryId: string): boolean {
    return this.selectedCategoryId === categoryId
  }
  onCategorySelect(categoryId: string): void {
    this.selectedCategoryId = this.selectedCategoryId === categoryId ? null : categoryId
    this.categorySelected.emit(this.selectedCategoryId)
  }

  subscribeToCategory(categoryId: string) {
    const subscription: Subscriptions = {
      category: categoryId,
    }

    this.Sub = this.subscriptionService.createSubscription(subscription).subscribe({
      next: (response: Message) => {
        if (response.message) {
          MaterialService.toast(response.message)
        } else {
          MaterialService.toast('Підписка створена успішно')
        }
      },
      error: (error) => {
        MaterialService.toast(error.error.message)
      }
    })
  }
  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }

}
