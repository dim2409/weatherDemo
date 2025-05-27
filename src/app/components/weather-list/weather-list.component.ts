import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { City } from '../../models/city.model';
import { MOCK_CITIES } from '../../models/mock-cities';
import { loadCities, goToNextPage, goToPrevPage, updateCityName } from '../../state/weather.actions';
import { selectPaginatedCities, selectCurrentPage, selectTotalPages, selectLoading, selectTempUnit } from '../../state/weather.selectors';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-weather-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './weather-list.component.html',
  styleUrl: './weather-list.component.css'
})

export class WeatherListComponent implements OnInit {
  cities$!: Observable<City[]>;

  periodNames: string[] = ['per1', 'per2', 'per3'];

  currentPage$!: Observable<number>;
  totalPages$!: Observable<number>;

  editingId: string | null = null;
  editingName: string = '';
  loading$!: Observable<boolean>;
  tempUnit$!: Observable<'si' | 'us'>;



  constructor(private store: Store) {

    //observables 
    this.loading$ = this.store.select(selectLoading);
    this.cities$ = this.store.select(selectPaginatedCities);
    this.currentPage$ = this.store.select(selectCurrentPage);
    this.totalPages$ = this.store.select(selectTotalPages);
    this.tempUnit$ = this.store.select(selectTempUnit);

    //fill period names from the first city
    this.cities$.subscribe(cities => {
      if (cities && cities.length > 0) {
        this.periodNames = cities[0].periods.slice(0, 3).map(period => period.name);
      }
    });
  }

  // initiate the app
  ngOnInit() {
    this.store.dispatch(loadCities({ cities: MOCK_CITIES }));
  }

  nextPage() {
    this.store.dispatch(goToNextPage());
  }
  prevPage() {
    this.store.dispatch(goToPrevPage());
  }

  startEdit(id: string, currentName: string) {
    this.editingId = id;
    this.editingName = currentName;
  }

  saveEdit(id: string) {
    const cleanName = this.sanitizeInput(this.editingName);
    if (cleanName) {
      this.store.dispatch(updateCityName({ cityId: id, name: cleanName }));
    }
    this.editingId = null;
    this.editingName = '';
  }

  // sanitize inline input
  sanitizeInput(value: string): string {
    const regex = /[^a-zA-Z0-9]/g;
    return value.replace(regex, '').trim();
  }
}