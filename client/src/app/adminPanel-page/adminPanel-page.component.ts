import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryPageComponent} from "./category-page/category-page.component";
import {NewsPageComponent} from "./news-page/news-page.component";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "../shared/components/loader/loader.component";
import {RouterLink} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {Category, Feedback, News} from "../shared/interfaces";
import {NewsServices} from "../shared/services/news.services";
import {CategoriesServices} from "../shared/services/categories.services";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FeedbackService} from "../shared/services/feedback.services";
import {MaterialService} from "../shared/classes/material.service";


@Component({
  selector: 'app-adminPanel-page',
  standalone: true,
  imports: [
    CategoryPageComponent,
    NewsPageComponent,
    AsyncPipe,
    LoaderComponent,
    NgForOf,
    NgIf,
    RouterLink,
    DatePipe,
    ReactiveFormsModule,
  ],
  templateUrl: './adminPanel-page.component.html',
  styleUrl: './adminPanel-page.component.css'
})
export class AdminPanelPageComponent implements OnInit, OnDestroy {
  categories$!: Observable<Category[]>
  isAdmin = true
  adminResponseForm!: FormGroup
  feedbacks: Feedback[] = []
  selectedFeedback?: Feedback
  Sub!: Subscription
  constructor(private categoriesService: CategoriesServices, private fb: FormBuilder, private newsService: NewsServices, private feedbackService: FeedbackService) {
  }
  news$!: Observable<News[]>
  ngOnInit() {
    this.categories$ = this.categoriesService.fetch()
    this.news$ = this.newsService.fetch()
    this.loadFeedbacks()
    this.adminResponseForm = this.fb.group({
      response: ['', Validators.required]
    })

  }



  selectFeedback(feedback: Feedback) {
    this.selectedFeedback = feedback
  }
  loadFeedbacks() {
    this.Sub = this.feedbackService.getAllFeedbacks().subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks
      },
      error: (error) => MaterialService.toast(error.error.message)
    })
  }

  submitResponse(feedbackId: string | undefined) {
    if (this.selectedFeedback && this.selectedFeedback._id && this.adminResponseForm.valid) {
      const adminResponse = {
        adminResponse: this.adminResponseForm.value.response,
        respondedAt: new Date()
      }

      this.Sub = this.feedbackService.updateFeedback(feedbackId, adminResponse).subscribe({
        next: updatedFeedback => {
          if (this.selectedFeedback && Array.isArray(this.selectedFeedback.adminResponses)) {
            this.selectedFeedback.adminResponses.push({
              response: adminResponse.adminResponse,
              respondedAt: adminResponse.respondedAt
            })
            const index = this.feedbacks.findIndex(feedback => feedback._id === feedbackId)
            if (index !== -1 && this.selectedFeedback) {
              this.adminResponseForm.reset()
              this.feedbacks[index] = {
                ...this.feedbacks[index],
                adminResponses: this.selectedFeedback.adminResponses

              }
            }
          }
        },
        error: error => MaterialService.toast(error.error.message)
      })
    }
  }
  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }
}
