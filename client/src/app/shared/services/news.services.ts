import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {News} from "../interfaces";
import {BehaviorSubject, Observable, timer} from "rxjs";

const REFRESH_INTERVAL = 300000
@Injectable({
  providedIn: 'root'
})
export class NewsServices {
  private cache$ = new BehaviorSubject<News[]>([])
  private reload$ = timer(0, REFRESH_INTERVAL)
  private lastFetchTime: number | null = null
  constructor(private http: HttpClient) {
    this.reload$.subscribe(() => {
      this.fetchMain()
    })
  }
  create(news: News): Observable<News> {
    return this.http.post<News>('http://localhost:5000/api/news', news)
  }
  getById(id: string): Observable<News> {
    return this.http.get<News>(`http://localhost:5000/api/news/${id}`)
  }
  updateById(news: News): Observable<News> {
    return this.http.put<News>(`http://localhost:5000/api/news/${news._id}`, news)
  }
  deleteById(news: News): Observable<any> {
    return this.http.delete(`http://localhost:5000/api/news/${news._id}`)
  }
  fetchByCategoryId(categoryIds: string | string[]): Observable<News[]> {
    let params = new HttpParams()

    if (Array.isArray(categoryIds)) {
      categoryIds.forEach(id => params = params.append('categoryId', id))
    } else {
      params = params.append('categoryId', categoryIds)
    }
    return this.http.get<News[]>('http://localhost:5000/api/news', { params })
  }
  fetch(params: any = {}): Observable<News[]> {
    return this.http.get<News[]>('http://localhost:5000/api/news', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }
  fetchP(params: any = {}): Observable<News[]> {
    return this.http.get<News[]>('http://localhost:5000/api/news', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }
  fetchMain(): void {
    const now = Date.now()
    if (!this.lastFetchTime || now - this.lastFetchTime > REFRESH_INTERVAL) {
      this.lastFetchTime = now
      this.fetchP().subscribe(news => {
        this.cache$.next(news)
      })
    }
  }
  getCache(): Observable<News[]> {
    this.fetchMain()
    return this.cache$.asObservable()
  }

  addComment(newsId: string | undefined, comment: { text: string, userId: string }): Observable<News> {
    return this.http.post<News>(`http://localhost:5000/api/news/comment/${newsId}`, comment)
  }
}
