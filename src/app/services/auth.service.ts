import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.isLoggedInSubject.asObservable();

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user);
      this.isLoggedInSubject.next(!!user);
    });
  }

  login(email: string, password: string): Observable<void> {
    return new Observable((observer) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then(() => {
          console.log('Login successful');
          observer.complete();
        })
        .catch((err) => {
          console.error('Login failed:', err);
          observer.error(err);
        });
    });
  }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.log('Logout successful');
        this.isLoggedInSubject.next(false);
      })
      .catch((err) => console.error('Logout failed:', err));
  }
}
