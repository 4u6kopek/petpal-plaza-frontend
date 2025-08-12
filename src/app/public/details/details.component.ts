import { Component } from '@angular/core';

@Component({
  selector: 'app-details',
  standalone: true,
  template: '<p>Pet Details Page (ID: {{ id }})</p>',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent {
  id = '';
}
