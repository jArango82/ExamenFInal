import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  showPassword = false;
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router){}

  async onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;
  
    try {
      const success = await this.authService.login(this.loginData.email, this.loginData.password);
      if (success) {
        // Redirigir a la página principal o dashboard
        this.router.navigate(['/reseñas']);
      } else {
        this.errorMessage = 'Correo o contraseña incorrectos';
      }
    } catch (error: any) {
      this.errorMessage = error || 'Hubo un problema al iniciar sesión. Intenta nuevamente.';
    } finally {
      this.isLoading = false;
    }
  }
  

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}