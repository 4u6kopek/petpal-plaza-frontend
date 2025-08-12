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
      this.isLoggedInSubject.next(!!user);
    });
  }

  login(email: string, password: string): Observable<void> {
    return new Observable((observer) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then(() => observer.complete())
        .catch((err) => observer.error(err));
    });
  }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        this.isLoggedInSubject.next(false);
      })
      .catch((err) => console.error('Logout failed', err));
  }
}
