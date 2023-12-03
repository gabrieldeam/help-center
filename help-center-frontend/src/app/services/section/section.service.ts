import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Section } from '../../models/section';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SectionService {
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

  getSections(): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}/section`);
  }

  createSection(section: { name: string, topicId: string }): Observable<Section> {
    const headers = this.addTokenToHeaders();
    return this.http.post<Section>(`${this.apiUrl}/section`, section, { headers });
  }

  deleteSection(id: string): Observable<{ message: string }> {
    const headers = this.addTokenToHeaders();
    return this.http.delete<{ message: string }>(`${this.apiUrl}/section/${id}`, { headers });
  }

  updateSection(id: string, section: { name: string, topicId: string }): Observable<Section> {
    const headers = this.addTokenToHeaders();
    return this.http.put<Section>(`${this.apiUrl}/section/${id}`, section, { headers });
  }

}
