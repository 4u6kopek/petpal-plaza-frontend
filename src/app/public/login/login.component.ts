import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login() {
    this.error = null;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        const returnUrl =
          this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.router.navigate([returnUrl], { replaceUrl: true });
      },
      error: (err) => {
        if (err.code === 'auth/wrong-password') {
          this.error = 'Incorrect password. Please try again.';
        } else if (err.code === 'auth/user-not-found') {
          this.error = 'No account found with this email.';
        } else if (err.code === 'auth/invalid-email') {
          this.error = 'Invalid email format.';
        } else {
          this.error = 'Login failed. Please try again.';
        }
        console.error('Login failed:', err);
      },
    });
  }
}
