import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';
import { Pet } from '../../models/pet.interface';
import { AgePipe } from '../../pipes/age.pipe';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink, AgePipe],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  pets: Pet[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getPets().subscribe({
      next: (pets) => {
        this.pets = pets.map((pet) => ({
          ...pet,
          imageUrl: pet.imageUrl || '/assets/images/fallback-pet.png',
        }));
      },
      error: (err) => console.error('Error fetching pets', err),
    });
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/assets/images/fallback-pet.png';
  }
}
