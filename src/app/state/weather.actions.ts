import { createAction, props } from '@ngrx/store';
import { City } from '../models/city.model';

//load cities
export const loadCities = createAction(
  '[Weather] load cities',
  props<{ cities: City[] }>()
);

//change temperature unit
export const setTempUnit = createAction(
  '[Weather] set temperature unit',
  props<{ unit: 'us' | 'si' }>()
);

// update city name from user input
export const updateCityName = createAction(
  '[Weather] Update City Name',
  props<{ cityId: string; name: string }>()
);

// succesful response
export const loadCitiesSuccess = createAction(
  '[Weather] Load Cities Success',
  props<{ cities: City[] }>()
);

export const goToNextPage = createAction('[Weather] Go To Next Page');
export const goToPrevPage = createAction('[Weather] Go To Previous Page');