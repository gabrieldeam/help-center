import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  // Método chamado ao clicar no botão "Sair"
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
