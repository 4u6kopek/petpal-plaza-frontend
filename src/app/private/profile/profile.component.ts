import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Pet } from '../../models/pet.interface';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userPets: Pet[] = [];
  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.apiService.getPets().subscribe({
        next: (pets) =>
          (this.userPets = pets.filter((pet) => pet.ownerId === userId)),
        error: (err) => console.error('Error fetching user pets', err),
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
