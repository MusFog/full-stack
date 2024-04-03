import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {News} from "../../shared/interfaces";
import {MaterialService} from "../../shared/classes/material.service";
import {NewsServices} from "../../shared/services/news.services";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-news-item-page',
  standalone: true,
  imports: [
    AsyncPipe,
    LoaderComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    DatePipe
  ],
  templateUrl: './news-item-page.component.html',
  styleUrl: './news-item-page.component.css'
})
export class NewsItemPageComponent implements OnInit, OnDestroy{
  form!: FormGroup
  loading = false
  news!: News[]
  newsItem!: News
  commentForm!: FormGroup
  Sub!: Subscription
  constructor(private fb: FormBuilder, private newsService: NewsServices, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.commentForm = this.fb.group({
      text: ['', Validators.required]
    })
    this.Sub = this.route.params.subscribe(params => {
      const id = params['id']
      this.Sub = this.newsService.getById(id).subscribe(
        news => {
          this.newsItem = news
          this.loading = false
        },
        error => {
          MaterialService.toast(error.error.message)
          this.loading = false
        }
      )
    })
  }
  submitComment(): void {
    if (this.commentForm.valid && this.newsItem) {
      this.Sub = this.newsService.addComment(this.newsItem._id, this.commentForm.value).subscribe({
        next: (response) => {
          if (response.comment && this.newsItem) {
            this.newsItem.comment = [...(this.newsItem.comment ?? []), response.comment[response.comment.length - 1]]
          }
          this.commentForm.reset()
          this.loadComments()
        },
        error: (error) => MaterialService.toast(error.error.message),
      })
    }
  }
  loadComments(): void {
    if (this.newsItem && this.newsItem._id) {
      this.Sub = this.newsService.getById(this.newsItem._id).subscribe(newsItem => {
        this.newsItem.comment = newsItem.comment
        this.newsItem = newsItem
      })
    }
  }
  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }
}
