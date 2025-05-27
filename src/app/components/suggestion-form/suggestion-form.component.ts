import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCities, selectTempUnit } from '../../state/weather.selectors';
import { Observable, map, firstValueFrom } from 'rxjs';
import { City } from '../../models/city.model';
import { jsPDF } from 'jspdf';
import { FormsModule, NgForm } from '@angular/forms';
import { updateCityName } from '../../state/weather.actions';

@Component({
  selector: 'app-suggestion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent {
  city$!: Observable<City | undefined>;
  tempUnit$!: Observable<'si' | 'us'>;

  editingName = '';
  userName = '';
  email = '';
  suggestion = '';
  originalCityName = '';

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {
    // stream of current temp unit
    this.tempUnit$ = this.store.select(selectTempUnit);

    // load the city from the store by id
    const cityId = this.route.snapshot.paramMap.get('cityId');
    this.city$ = this.store.select(selectCities).pipe(
      map(cities => {
        const city = cities.find(c => c.id === cityId);
        if (city) {
          this.editingName = city.name;
          this.originalCityName = city.name;
        }
        return city;
      })
    );
  }

  async submit(city: City | undefined) {
    if (!city) return;

    // sanitize
    const cleanCity = this.sanitizeInput(this.editingName);
    const cleanName = this.sanitizeInput(this.userName);
    const cleanEmail = this.sanitizeInput(this.email, true);
    const cleanSug = this.sanitizeInput(this.suggestion);

    if (!cleanCity || !cleanName || !cleanEmail || !cleanSug) {
      alert('fill all fields');
      return;
    }

    // check if it is email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      alert('Enter a valid e-mail.');
      return;
    }

    // update city name in store if changed
    if (cleanCity !== city.name) {
      this.store.dispatch(updateCityName({
        cityId: city.id,
        name: cleanCity
      }));
    }

    // fetch current temp unit
    const unit = await firstValueFrom(this.tempUnit$);
    const suffix = unit === 'si' ? '°C' : '°F';

    // build PDF
    const doc = new jsPDF();
    let y = 10;
    doc.text(`City: ${cleanCity}`, 10, y);
    y += 10;
    doc.text(`User Name: ${cleanName}`, 10, y);
    y += 10;
    doc.text(`Email: ${cleanEmail}`, 10, y);
    y += 10;
    doc.text('Suggestion:', 10, y);
    y += 10;
    doc.text(cleanSug, 10, y);
    y += 15;

    //period forecast
    doc.text('Forecast:', 10, y);
    y += 10;
    city.periods.slice(0, 3).forEach(p => {
      const line = `${p.name}: ${p.temperature}${suffix} — ${p.shortForecast}`;
      doc.text(line, 10, y);
      y += 8;
    });

    doc.save(`suggestion_${city.id}.pdf`);
  }

  //reset form fields
  reset(form: NgForm) {
    this.editingName = this.originalCityName;
    this.userName = '';
    this.email = '';
    this.suggestion = '';
    form.resetForm({
      cityName: this.originalCityName,
      userName: '',
      email: '',
      suggestion: ''
    });
  }

  //strip out all characters except letters, numbers space dot comma and optionally @ id allowat is true
  sanitizeInput(value: string, allowAt = false): string {
    const regex = allowAt ? /[^a-zA-Z0-9 .,@]/g : /[^a-zA-Z0-9 .,]/g;
    return value.replace(regex, '').trim();
  }
}
