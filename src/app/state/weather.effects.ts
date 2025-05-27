import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { mergeMap, map, withLatestFrom } from 'rxjs/operators';
import { WeatherService } from '../services/weather.service';
import { loadCities, loadCitiesSuccess, setTempUnit } from './weather.actions';
import { selectCities, selectTempUnit } from './weather.selectors';

@Injectable()
export class WeatherEffects {

  private actions$ = inject(Actions);
  private store = inject(Store);
  private weather = inject(WeatherService);

  // listen for loadCities action and fetch forecasts for each city
  loadCities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCities),
      withLatestFrom(this.store.select(selectTempUnit)),
      mergeMap(([{ cities }, unit]) =>
        forkJoin( // get all city forecasts and pipe them into an array with loadCitiesSuccess action
          cities.map(city =>
            this.weather.getForecastForCoords(city.lat, city.lon, unit).pipe(
              map(periods => ({
                ...city,
                periods: periods.slice(0, 3)
              }))
            )
          )
          // when forkjoin is satisfied, call loadCitiesSuccess with gathered cities piped as param
        ).pipe(
          map(list => loadCitiesSuccess({ cities: list }))
        )
      )
    )
  );

  // listen for setTempUnit action and reload cities with new unit
  reloadOnUnitChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setTempUnit),
      withLatestFrom(this.store.select(selectCities)),
      map(([, cities]) => loadCities({ cities })) // ignore unit param as it will be used in loadCities$ effect when the reload will happen
    )
  );
}
