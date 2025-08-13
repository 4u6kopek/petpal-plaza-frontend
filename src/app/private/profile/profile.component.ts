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
  username: string | null = null;

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
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

  getInitials(username: string | null): string {
    if (!username) return '??';
    const names = username.trim().split(/\s+/);
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  }
}
