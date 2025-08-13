import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  register() {
    this.error = null;
    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        const returnUrl =
          this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.router.navigate([returnUrl], { replaceUrl: true });
      },
      error: (err) => {
        if (err.code === 'auth/email-already-in-use') {
          this.error = 'This email is already registered.';
        } else if (err.code === 'auth/invalid-email') {
          this.error = 'Invalid email format.';
        } else if (err.code === 'auth/weak-password') {
          this.error = 'Password is too weak. Use at least 6 characters.';
        } else {
          this.error = 'Registration failed. Please try again.';
        }
        console.error('Registration failed:', err);
      },
    });
  }
}
