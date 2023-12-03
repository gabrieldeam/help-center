import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../../models/article';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private addTokenToHeaders(): HttpHeaders {
    // Obtenha o token do localStorage
    const token = localStorage.getItem('token');

    // Configure os cabeçalhos com o token
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getArticle(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/article`);
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/article/${id}`);
  }

  searchArticles(query: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/article/search?q=${query}`);
  }

  createArticle(article: { title: string, content: string, useful: boolean, sectionId: string }): Observable<Article> {
    const headers = this.addTokenToHeaders();
    return this.http.post<Article>(`${this.apiUrl}/article`, article, { headers });
  }

  deleteArticle(id: string): Observable<{ message: string }> {
    const headers = this.addTokenToHeaders();
    return this.http.delete<{ message: string }>(`${this.apiUrl}/article/${id}`, { headers });
  }

  updateArticle(id: string, article: { title: string, content: string, useful: boolean, sectionId: string }): Observable<Article> {
    const headers = this.addTokenToHeaders();
    return this.http.put<Article>(`${this.apiUrl}/article/${id}`, article, { headers });
  }

}