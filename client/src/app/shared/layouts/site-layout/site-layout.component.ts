import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NgForOf} from "@angular/common";
import {AuthServices} from "../../services/auth.services";
import {MaterialService} from "../../classes/material.service";

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgForOf,
    RouterLinkActive
  ],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.css'
})
export class SiteLayoutComponent {

  links = [

    {url: '/main', name: 'Головна сторінка'},
    {url: '/adminPanel', name: 'AdminPanel'},
    {url: '/authors', name: 'Автори'},
    {url: '/search', name: 'Пошук'},
    {url: '/feedback', name: 'Зворотній зв\'язок'},
    {url: '/categoryAll', name: 'Категорії'}
  ]

  constructor(private auth: AuthServices, private router: Router) {

  }

  logout(event: Event) {
    event.preventDefault()
    this.auth.logout()
    this.router.navigate(['/login'])
  }
}
