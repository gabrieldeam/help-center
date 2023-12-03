import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../../models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  login(user: User): Observable<HttpResponse<any>> {
    return this.http.post(`${this.apiUrl}/auth/login`, user, { observe: 'response' })
      .pipe(tap((response: HttpResponse<any>) => this.saveTokenFromResponse(response)));
  }

  logout() {
    localStorage.removeItem('token');
    this.token = null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();

    // Verificar se o token existe e não está expirado
    if (token) {
      const tokenData = this.decodeToken(token);
      const currentTime = Date.now() / 1000; // Tempo atual em segundos

      return tokenData && tokenData.exp && tokenData.exp > currentTime;
    }

    return false;
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  saveTokenFromResponse(response: HttpResponse<any>): void {
    const token = response.body.token; // Modifique para refletir a estrutura real da resposta
    if (token) {
      localStorage.setItem('token', token);
      this.token = token; // Armazene o token na propriedade para referência posterior
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }
}
