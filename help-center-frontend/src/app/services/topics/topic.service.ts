import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../../models/topic';
import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
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

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.apiUrl}/topic`);
  }

  createTopic(topicData: { name: string; image: File }): Observable<Topic> {
    const headers = this.addTokenToHeaders();
    const formData = new FormData();
    formData.append('name', topicData.name);
    formData.append('image', topicData.image);
  
    return this.http.post<Topic>(`${this.apiUrl}/topic`, formData, { headers }).pipe(
      tap((createTopic) => {
        console.log('Create Topic:', createTopic);
      }),
      catchError((error) => {
        console.error('Error create Topic:', error);
        throw error;
      })
    );
  }


  updateTopic(id: string, topic: { name: string }): Observable<Topic> {
    const headers = this.addTokenToHeaders();
    return this.http.put<Topic>(`${this.apiUrl}/topic/${id}`, topic, { headers }).pipe(
      tap((updatedTopic) => {
        console.log('Updated Topic:', updatedTopic);
      }),
      catchError((error) => {
        console.error('Error updating Topic:', error);
        throw error;
      })
    );
  }

  deleteTopic(_id: string, imagePath: string | null): Observable<void> {
    const headers = this.addTokenToHeaders();
    // Especificar o tipo para headers e body
    const options: { headers: HttpHeaders; body?: { imagePath: string } } = { headers };
  
    // Se houver um caminho de imagem, adicione ao corpo da solicitação
    if (imagePath) {
      options.body = { imagePath };
    }
  
    return this.http.delete<void>(`${this.apiUrl}/topic/${_id}`, options).pipe(
      tap(() => {
        console.log('Deleted Topic with ID:', _id);
      }),
      catchError((error) => {
        console.error('Error deleting Topic:', error);
        throw error;
      })
    );
  }
  
  

  updateTopicWithImageAndDeleteOldImage(id: string, formData: FormData): Observable<Topic> {
    const headers = this.addTokenToHeaders();
    return this.http.put<Topic>(`${this.apiUrl}/topic/${id}/update-with-image`, formData, { headers }).pipe(
      tap((updatedTopic) => {
        console.log('Updated Topic with Image:', updatedTopic);
      }),
      catchError((error) => {
        console.error('Error updating Topic with Image:', error);
        throw error;
      })
    );
  }

  getTopicById(topicId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/topic/${topicId}`);
  }

}
