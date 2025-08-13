import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Pet } from '../../models/pet.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  id: string = '';
  pet: Pet | undefined;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.apiService.getPet(this.id).subscribe({
        next: (pet) => {
          this.pet = {
            ...pet,
            imageUrl: pet.imageUrl || '/assets/images/fallback-pet.png',
          };
        },
        error: (err) => console.error('Error fetching pet details', err),
      });
    }
  }

  deletePet() {
    if (this.pet && this.pet.ownerId === this.authService.getUserId()) {
      this.apiService.deletePet(this.id).subscribe({
        next: () => this.router.navigate(['/catalog']),
        error: (err) => console.error('Error deleting pet', err),
      });
    }
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/assets/images/fallback-pet.png';
  }
}
