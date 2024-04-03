import {Injectable} from "@angular/core";
import {User} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  private token: string | null = null
  constructor(private http: HttpClient) {
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:5000/api/auth/register', user)
  }
  login(user: User): Observable<{token: string}> {
    return this.http.post<{token: string}>('http://localhost:5000/api/auth/login', user)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token)
            this.setToken(token)
          }
        )
      )
  }
  setToken(token: string | null) {
    this.token = token
  }

  getToken(): string {
    return <string>this.token
  }


  isAuthenticated(): boolean {
    return !!this.token
  }
  logout() {
    this.setToken(null)
    localStorage.clear()
  }
}
