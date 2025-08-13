import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Pet } from '../../models/pet.interface';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  recentPets: Pet[] = [];

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiService.getPets().subscribe({
      next: (pets) => {
        this.recentPets = [...pets]
          .sort((a, b) => {
            const likesDiff = b.likes.length - a.likes.length;
            return likesDiff !== 0 ? likesDiff : a.name.localeCompare(b.name);
          })
          .slice(0, 5)
          .map((pet) => ({
            ...pet,
            imageUrl: pet.imageUrl || '/assets/images/fallback-pet.png',
          }));
      },
      error: (err) => console.error('Error fetching pets', err),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/assets/images/fallback-pet.png';
  }
}
