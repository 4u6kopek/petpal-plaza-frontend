import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Pet } from '../models/pet.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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
    return this.http.get<Pet>(`${this.apiUrl}/pets/${id}`);
  }

  createPet(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/pets`, pet);
  }

  updatePet(id: string, pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/pets/${id}`, pet);
  }

  deletePet(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pets/${id}`);
  }

  addLike(id: string, userId: string): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/pets/${id}/likes`, { userId });
  }

  addComment(id: string, comment: Comment): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/pets/${id}/comments`, comment);
  }
}
