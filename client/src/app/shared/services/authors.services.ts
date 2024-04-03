import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {News, User} from "../interfaces";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class AuthorsServices {
  constructor(private http: HttpClient) {
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/author')
  }
  getNewsByAuthor(id: string): Observable<News[]> {
    return this.http.get<News[]>(`http://localhost:5000/api/author/${id}`)
  }
}
