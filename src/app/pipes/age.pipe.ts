import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true,
})
export class AgePipe implements PipeTransform {
  transform(value: number): string {
    if (!value || value <= 0) {
      return 'Less than a year old';
    }
    return value === 1 ? '1 year old' : `${value} years old`;
  }
}
