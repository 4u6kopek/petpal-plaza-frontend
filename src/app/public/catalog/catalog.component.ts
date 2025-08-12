import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';
import { Pet } from '../../models/pet.interface';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent implements OnInit {
  pets: Pet[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getPets().subscribe({
      next: (pets) => (this.pets = pets),
      error: (err) => console.error('Error fetching pets', err),
    });
  }
}
