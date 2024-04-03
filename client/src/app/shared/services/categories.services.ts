import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Category, CategoryResponse, Message} from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoriesServices {
  constructor(private http: HttpClient) {

  }

  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:5000/api/category')
  }
  fetchP(params: any = {}): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>('http://localhost:5000/api/categoryAll', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`http://localhost:5000/api/category/${id}`)
  }

  create(name: string, description: string, image?: File): Observable<Category> {
    const fd = new FormData()
    if (image) {
      fd.append('image', image, image.name)
    }
    fd.append('name', name)
    fd.append('description', description)
    return this.http.post<Category>('http://localhost:5000/api/category', fd)
  }

  updateById(id: string | undefined, name: string, description: string, image?: File): Observable<Category> {
    const fd = new FormData()
    if (image) {
      fd.append('image', image, image.name)
      console.log(image)
    }
    fd.append('name', name)
    fd.append('description', description)
    return this.http.patch<Category>(`http://localhost:5000/api/category/${id}`, fd)
  }

  deleteById(id: string): Observable<Message> {
    return this.http.delete<Message>(`http://localhost:5000/api/category/${id}`)
  }
}
