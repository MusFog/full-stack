import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
import {Message, Subscriptions} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) {}

  createSubscription(subscription: Subscriptions): Observable<Message>{
    return this.http.post<Message>('http://localhost:5000/api/subscriptions', subscription)
  }

}
