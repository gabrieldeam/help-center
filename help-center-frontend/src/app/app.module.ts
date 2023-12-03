import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TopicsComponent } from './components/dashboard/topics/topics.component';
import { SectionComponent } from './components/dashboard/section/section.component';
import { ArticlesComponent } from './components/dashboard/articles/articles.component';
import { HomeComponent } from './components/home/home.component';
import { CreateTopicComponent } from './components/dashboard/topics/create-topic/create-topic.component';
import { CreateSectionComponent } from './components/dashboard/section/create-section/create-section.component';
import { CreateArticlesComponent } from './components/dashboard/articles/create-articles/create-articles.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpdateTopicComponent } from './components/dashboard/topics/update-topic/update-topic.component';
import { UpdateSectionComponent } from './components/dashboard/section/update-section/update-section.component';
import { UpdateArticlesComponent } from './components/dashboard/articles/update-articles/update-articles.component';
import { SearchInputComponent } from './components/search/search-input/search-input.component';
import { SearchResultComponent } from './components/search/search-result/search-result.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { ArticleUsefulComponent } from './components/home/article-useful/article-useful.component';
import { TopicListComponent } from './components/home/topic-list/topic-list.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    TopicsComponent,
    SectionComponent,
    ArticlesComponent,
    HomeComponent,
    CreateTopicComponent,
    CreateSectionComponent,
    CreateArticlesComponent,
    UpdateTopicComponent,
    UpdateSectionComponent,
    UpdateArticlesComponent,
    SearchInputComponent,
    SearchResultComponent,
    ArticleDetailComponent,
    ArticleUsefulComponent,
    TopicListComponent,
    TopicDetailComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
