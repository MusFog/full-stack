import {RouterModule, Routes} from '@angular/router';
import {NgModule} from "@angular/core";
import {LoginPageComponent} from "./login-page/login-page.component";
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {RegisterPageComponent} from "./register-page/register-page.component";
import {AuthGuard} from "./shared/classes/auth.guard";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {AdminPanelPageComponent} from "./adminPanel-page/adminPanel-page.component";
import {CategoryPageComponent} from "./adminPanel-page/category-page/category-page.component";
import {NewsPageComponent} from "./adminPanel-page/news-page/news-page.component";
import {NewsItemPageComponent} from "./main-page/news-item-page/news-item-page.component";
import {AuthorsPageComponent} from "./authors-page/authors-page.component";
import {NewsSearchPageComponent} from "./news-search-page/news-search-page.component";
import {FeedbackPageComponent} from "./feedback-page/feedback-page.component";
import {AuthorsNewsPageComponent} from "./authors-page/authors-news-page/authors-news-page.component";
import {CategoryAllPageComponent} from "./category-all-page/category-all-page.component";

export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'register', component: RegisterPageComponent}
    ]
  },
  {
    path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
      {path: 'main', component: MainPageComponent },
      {path: 'adminPanel', component: AdminPanelPageComponent },
      {path: 'category/new', component: CategoryPageComponent},
      {path: 'category/:id', component: CategoryPageComponent},
      {path: 'news/new', component: NewsPageComponent},
      {path: 'newsItem/:id', component: NewsItemPageComponent},
      {path: 'authors', component: AuthorsPageComponent},
      {path: 'authors/:id', component: AuthorsNewsPageComponent},
      {path: 'search', component: NewsSearchPageComponent},
      {path: 'search/:id', component: NewsSearchPageComponent},
      {path: 'feedback', component: FeedbackPageComponent},
      {path: 'categoryAll', component: CategoryAllPageComponent},
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
