import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterLink,
} from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Pet } from '../../models/pet.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, RouterModule, RouterLink],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
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
  id: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id) {
      this.apiService.getPet(this.id).subscribe({
        next: (pet) => {
          if (pet.ownerId === this.authService.getUserId()) {
            this.pet = pet;
          } else {
            this.router.navigate(['/catalog']);
          }
        },
        error: (err) => console.error('Error fetching pet', err),
      });
    }
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
        'All fields except Image URL must be filled with valid data.';
      return;
    }

    this.apiService.updatePet(this.id, this.pet).subscribe({
      next: () => this.router.navigate(['/details', this.id]),
      error: (err) => {
        this.error = 'Failed to update pet. Please try again.';
        console.error('Update pet error', err);
      },
    });
  }
}
