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
      if (user) {
        user.getIdToken().then((token) => {
          localStorage.setItem('firebase-token', token);
        });
      } else {
        localStorage.removeItem('firebase-token');
      }
    });
  }

  login(email: string, password: string): Observable<void> {
    return new Observable((observer) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((credential) => {
          credential.user.getIdToken().then((token) => {
            localStorage.setItem('firebase-token', token);
            observer.complete();
          });
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
        localStorage.removeItem('firebase-token');
        this.isLoggedInSubject.next(false);
      })
      .catch((err) => console.error('Logout failed:', err));
  }
}
