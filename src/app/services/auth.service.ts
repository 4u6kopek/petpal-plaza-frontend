import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  User,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.isLoggedInSubject.asObservable();
  private userIdSubject = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSubject.asObservable();

  constructor(private auth: Auth) {
    const initialUser = this.auth.currentUser;
    console.log('Initial auth state:', initialUser);
    this.isLoggedInSubject.next(!!initialUser);
    this.userIdSubject.next(initialUser ? initialUser.uid : null);
    if (initialUser) {
      initialUser.getIdToken().then((token) => {
        localStorage.setItem('firebase-token', token);
      });
    }

    this.auth.onAuthStateChanged((user: User | null) => {
      console.log('Auth state changed:', user ? user.uid : null);
      this.isLoggedInSubject.next(!!user);
      this.userIdSubject.next(user ? user.uid : null);
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

  register(email: string, password: string): Observable<void> {
    return new Observable((observer) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((credential) => {
          credential.user.getIdToken().then((token) => {
            localStorage.setItem('firebase-token', token);
            observer.complete();
          });
        })
        .catch((err) => {
          console.error('Registration failed:', err);
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
        this.userIdSubject.next(null);
      })
      .catch((err) => console.error('Logout failed:', err));
  }

  getUserId(): string | null {
    return this.userIdSubject.value;
  }
}
