import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { SearchResultComponent } from './components/search/search-result/search-result.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';

import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/guard/auth.guard';
import { DashboardAuthGuard } from './services/guard/dashboard-auth.guard';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TopicsComponent } from './components/dashboard/topics/topics.component';
import { CreateTopicComponent } from './components/dashboard/topics/create-topic/create-topic.component';
import { UpdateTopicComponent } from './components/dashboard/topics/update-topic/update-topic.component';

import { SectionComponent } from './components/dashboard/section/section.component';
import { CreateSectionComponent } from './components/dashboard/section/create-section/create-section.component';
import { UpdateSectionComponent } from './components/dashboard/section/update-section/update-section.component';

import { ArticlesComponent } from './components/dashboard/articles/articles.component';
import { CreateArticlesComponent } from './components/dashboard/articles/create-articles/create-articles.component';
import { UpdateArticlesComponent } from './components/dashboard/articles/update-articles/update-articles.component';


const dashboardRoutes: Routes = [
  { path: '', redirectTo: 'topics', pathMatch: 'full' },
  { path: 'topics', component: TopicsComponent, children: [
      { path: '', component: TopicsComponent },
      { path: 'create-topic', component: CreateTopicComponent, outlet: 'modal' },
      { path: 'update-topic', component: UpdateTopicComponent, outlet: 'modal' },
    ]},
  { path: 'section', component: SectionComponent, children: [
      { path: '', component: SectionComponent },
      { path: 'create-section', component: CreateSectionComponent, outlet: 'modal' },
      { path: 'update-section', component: UpdateSectionComponent, outlet: 'modal' },
    ]},
  { path: 'articles', component: ArticlesComponent, children: [
      { path: '', component: ArticlesComponent },
      { path: 'create-articles', component: CreateArticlesComponent, outlet: 'modal' },
      { path: 'update-articles', component: UpdateArticlesComponent, outlet: 'modal' },
    ]},
];


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [DashboardAuthGuard], children: dashboardRoutes },
  { path: 'search', component: SearchResultComponent },
  { path: 'article/:id', component: ArticleDetailComponent },
  { path: 'topic/:id', component: TopicDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
