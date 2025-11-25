import { Pipe, PipeTransform } from '@angular/core';
import { Age } from '../services/grocery.service';

/**
 * pipe to transform item elapsed time, age into readable format
 * input should be of number+"sec|min|hour|days|month" or just "now"
 */

@Pipe({
  name: 'ageReadable',
  standalone: true
})
export class AgeReadablePipe implements PipeTransform {
  transform(age: Age): string {
    if (age === 'now') {
      return 'Just now';
    }

    // Parse the age string to extract number and unit
    const match = age.match(/^(\d+)(sec|min|hour|day|week|month|year)$/);
    if (!match) {
      return age; // fallback to original if parsing fails
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    // Handle different time units
    switch (unit) {
      case 'sec':
        if (value < 30) return 'Just now';
        if (value < 60) return 'Less than a minute ago';
        return 'About a minute ago';

      case 'min':
        if (value === 1) return 'About a minute ago';
        if (value < 60) return `${value} minutes ago`;
        return 'About an hour ago';

      case 'hour':
        if (value === 1) return 'About an hour ago';
        if (value < 24) return `${value} hours ago`;
        return 'Yesterday';

      case 'day':
        if (value === 1) return 'Yesterday';
        if (value === 2) return 'Two days ago';
        if (value < 7) return `${value} days ago`;
        if (value < 14) return 'Last week';
        return this.getWeeksAgo(value);

      case 'week':
        if (value === 1) return 'Last week';
        if (value < 4) return `${value} weeks ago`;
        return 'Last month';

      case 'month':
        if (value === 1) return 'Last month';
        if (value < 12) return `${value} months ago`;
        return 'Last year';

      case 'year':
        if (value === 1) return 'Last year';
        return `${value} years ago`;

      default:
        return age;
    }
  }

  private getWeeksAgo(days: number): string {
    const weeks = Math.floor(days / 7);
    if (weeks === 2) return 'Two weeks ago';
    if (weeks === 3) return 'Three weeks ago';
    if (weeks < 4) return `${weeks} weeks ago`;
    return 'Last month';
  }
}