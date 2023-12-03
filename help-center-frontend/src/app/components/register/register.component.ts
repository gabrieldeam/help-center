import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = new User('', '');  // Inicialize com os valores adequados

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.user).subscribe(response => {
      console.log(response);  // Trate a resposta conforme necessário
    });
  }
}