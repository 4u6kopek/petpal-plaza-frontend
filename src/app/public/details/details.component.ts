import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Pet } from '../../models/pet.interface';
import { AuthService } from '../../services/auth.service';
import { AgePipe } from '../../pipes/age.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterLink, AgePipe, CommonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  id: string = '';
  pet: Pet | undefined;
  ownerUsername: string | null = null;
  isLiked: boolean = false;

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
          this.isLiked = this.authService.getUserId()
            ? pet.likes.includes(this.authService.getUserId()!)
            : false;
          this.apiService.getUserDisplayName(pet.ownerId).subscribe({
            next: (username) => (this.ownerUsername = username),
            error: (err) => {
              console.error('Error fetching owner username', err);
              this.ownerUsername = 'Unknown User';
            },
          });
        },
        error: (err) => console.error('Error fetching pet details', err),
      });
    }
  }

  toggleLike() {
    if (!this.pet || !this.authService.getUserId()) return;
    if (this.isLiked) {
      this.apiService.removeLike(this.pet._id!).subscribe({
        next: (updatedPet) => {
          this.pet = updatedPet;
          this.isLiked = false;
        },
        error: (err) => console.error('Error removing like', err),
      });
    } else {
      this.apiService.addLike(this.pet._id!).subscribe({
        next: (updatedPet) => {
          this.pet = updatedPet;
          this.isLiked = true;
        },
        error: (err) => console.error('Error adding like', err),
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

  getInitials(username: string | null): string {
    if (!username) return '??';
    const names = username.trim().split(/\s+/);
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  }
}
