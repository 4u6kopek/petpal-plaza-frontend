import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Pet } from '../../models/pet.interface';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  pet: Pet = {
    name: '',
    species: '',
    age: 0,
    description: '',
    ownerId: '',
    likes: [],
    comments: [],
    imageUrl: '',
  };
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {
    const userId = this.authService.getUserId();
    this.pet.ownerId = userId || '';
  }

  onSubmit() {
    if (
      !this.pet.name ||
      !this.pet.name.trim() ||
      !this.pet.species ||
      !this.pet.species.trim() ||
      this.pet.age <= 0 ||
      !this.pet.description ||
      !this.pet.description.trim()
    ) {
      this.error =
        'All fields except Image URL must be filled with valid data. Name, species, and description cannot be empty or just spaces.';
      return;
    }

    this.apiService.createPet(this.pet).subscribe({
      next: () => this.router.navigate(['/catalog']),
      error: (err) => {
        this.error = 'Failed to create pet. Please try again.';
        console.error('Create pet error', err);
      },
    });
  }
}
