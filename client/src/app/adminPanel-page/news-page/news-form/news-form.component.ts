import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { MaterialInstance, MaterialService } from "../../../shared/classes/material.service";
import { NewsServices } from "../../../shared/services/news.services";
import { News } from "../../../shared/interfaces";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    LoaderComponent,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.css']
})
export class NewsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('input') inputRef!: ElementRef
  @Input('categoryId') categoryId!: string
  @ViewChild('modal') modalRef!: ElementRef
  news!: News[]
  image!: File
  newsId: string | null | undefined = null
  loading = false
  modal!: MaterialInstance
  form!: FormGroup
  Sub!: Subscription

  constructor(private newsServices: NewsServices, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      articles: this.fb.array([]),
      category: this.categoryId,
    })
    if (this.categoryId) {
      const params = { categoryId: this.categoryId }
      this.loading = true
      this.Sub = this.newsServices.fetch(params).subscribe(news => {
        this.news = news
        this.loading = false
        if (news.length > 0 && news[0].articles) {
          this.fillFormWithArticles(news[0].articles)
        }
      })
    }
  }
  fillFormWithArticles(articles: any[]) {
    const articlesArray = this.form.get('articles') as FormArray
    articlesArray.clear()
    articles.forEach(article => {
      articlesArray.push(this.fb.group({
        title: [article.title, Validators.required],
        news: [article.news, Validators.required],
      }))
    })
    setTimeout(() => MaterialService.updateTextInputs(), 0)
  }
  ngOnDestroy() {
    this.modal.destroy?.()
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectNews(news: News) {
    this.newsId = news._id
    this.form.patchValue({
      name: news.name,
      description: news.description,
    })
    this.fillFormWithArticles(news.articles!)
    this.modal.open?.()
    MaterialService.updateTextInputs()
  }


  onAddNews() {
    this.newsId = null
    this.form.reset({
      name: '',
      description: '',
    })
    this.articles.clear()
    this.modal.open?.()
    MaterialService.updateTextInputs()
  }

  get articles() {
    return this.form.get('articles') as FormArray
  }

  addArticle() {
    const articleForm = this.fb.group({
      title: ['', Validators.required],
      news: ['', Validators.required],
    })
    this.articles.push(articleForm)
  }
  removeArticle(index: number) {
    this.articles.removeAt(index)
  }
  onCancel() {
    this.modal.close?.()
  }
  onSubmit() {
    this.form.disable()
    const newNews: News = {
      name: this.form.value.name,
      description: this.form.value.description,
      articles: this.form.value.articles,
      category: this.categoryId
    }
    const completed = () => {
      this.modal.close?.()
      this.form.reset({name: '', description: ''})
      this.form.enable()
    }
    if (this.newsId) {
      newNews._id = this.newsId
      this.Sub = this.newsServices.updateById(newNews).subscribe(
        news => {
          const idx = this.news.findIndex(n => n._id === news._id)
          this.news[idx] = news
          MaterialService.toast('Зміни було збережено')
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    } else {
      this.Sub = this.newsServices.create(newNews).subscribe(
        news => {
          MaterialService.toast('Новина створена')
          this.news.push(news)
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    }
  }
  onDeleteNews(event: Event, news: News) {
    event.stopPropagation()
    const decision = window.confirm(`Видалити новину ${news.name} ?`)
    if (decision) {
      this.Sub = this.newsServices.deleteById(news).subscribe(
        response => {
          const idx = this.news.findIndex(n => n._id === news._id)
          this.news.splice(idx, 1)
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }
}
