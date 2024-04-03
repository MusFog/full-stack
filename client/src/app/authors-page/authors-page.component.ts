import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../shared/interfaces";
import {AuthorsServices} from "../shared/services/authors.services";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-authors-page',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './authors-page.component.html',
  styleUrl: './authors-page.component.css'
})
export class AuthorsPageComponent implements OnInit, OnDestroy {
  authors: User[] = []
  Sub!: Subscription

  constructor(private authorsService: AuthorsServices) {}

  ngOnInit(): void {
    this.Sub = this.authorsService.getAll().subscribe((data: User[]) => {
      this.authors = data;
    })
  }
  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }
}
