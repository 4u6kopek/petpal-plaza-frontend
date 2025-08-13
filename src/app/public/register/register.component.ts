import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

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

  constructor(private auth: Auth, private router: Router) {}

  register() {
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((credential) => {
        credential.user.getIdToken().then((token) => {
          localStorage.setItem('firebase-token', token);
          this.router.navigate(['/home']);
        });
      })
      .catch((err) => {
        this.error = 'Registration failed. Please try again.';
        console.error('Registration failed', err);
      });
  }
}
