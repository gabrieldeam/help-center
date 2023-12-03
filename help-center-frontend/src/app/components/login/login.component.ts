import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user';
import { catchError, delay, tap } from 'rxjs/operators';
import { throwError, timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: User = new User('', '');  // Inicialize com os valores adequados
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.user)
      .pipe(
        catchError((error) => {
          this.errorMessage = error.error.message || 'Erro de autenticação';
          // Exibir a mensagem de erro por 30 segundos
          timer(10000).pipe(
            tap(() => {
              this.errorMessage = null; // Remover a mensagem após 30 segundos
            })
          ).subscribe();
          return throwError(error);
        })
      )
      .subscribe(response => {
        console.log(response);
        this.authService.saveTokenFromResponse(response);
        // Redirecione para a rota /dashboard
        this.router.navigate(['/dashboard']);
      });
  }
}
