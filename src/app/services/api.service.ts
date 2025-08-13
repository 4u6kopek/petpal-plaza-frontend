import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Pet } from '../models/pet.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    const token = localStorage.getItem('firebase-token');
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/pets`).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error fetching pets', error);
        throw error;
      })
    );
  }

  getPet(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/pets/${id}`).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error fetching pet', error);
        throw error;
      })
    );
  }

  getUserDisplayName(uid: string): Observable<string> {
    return this.http
      .get<{ displayName: string }>(`${this.apiUrl}/users/${uid}`)
      .pipe(
        map((response) => response.displayName),
        catchError((error) => {
          console.error('Error fetching user displayName', error);
          throw error;
        })
      );
  }

  createPet(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/pets`, pet, {
      headers: this.getHeaders(),
    });
  }

  updatePet(id: string, pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/pets/${id}`, pet, {
      headers: this.getHeaders(),
    });
  }

  deletePet(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pets/${id}`, {
      headers: this.getHeaders(),
    });
  }

  addLike(id: string): Observable<Pet> {
    return this.http.post<Pet>(
      `${this.apiUrl}/pets/${id}/likes`,
      {},
      { headers: this.getHeaders() }
    );
  }

  removeLike(id: string): Observable<Pet> {
    return this.http.delete<Pet>(`${this.apiUrl}/pets/${id}/likes`, {
      headers: this.getHeaders(),
    });
  }

  addComment(id: string, comment: any): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/pets/${id}/comments`, comment, {
      headers: this.getHeaders(),
    });
  }
}
