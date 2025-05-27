import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WeatherState } from './weather.state';

// get whole state
export const selectWeatherState = createFeatureSelector<WeatherState>('weather');

// get cities
export const selectCities = createSelector(
  selectWeatherState,
  (state) => state.cities
);

// get current page
export const selectCurrentPage = createSelector(
  selectWeatherState,
  (state) => state.currentPage
);

// get default page size 
export const selectPageSize = createSelector(
  selectWeatherState,
  (state) => state.pageSize
);

// get temp unit
export const selectTempUnit = createSelector(
  selectWeatherState,
  (state) => state.tempUnit
);

// get cities for current page
export const selectPaginatedCities = createSelector(
  selectCities,
  selectCurrentPage,
  selectPageSize,
  (cities, currentPage, pageSize) => {
    const start = (currentPage - 1) * pageSize; // calculate start index
    return cities.slice(start, start + pageSize); // slice the array to get cities from start index to start + pagesize
  }
);

// calc total pages based on total cities and pagination size
export const selectTotalPages = createSelector(
  selectCities,
  selectPageSize,
  (cities, pageSize) => Math.ceil(cities.length / pageSize) // math.ceil rounds up upwards to ensure the modulo of the dibision gets its own page
);

// select loading state
export const selectLoading = createSelector(
  selectWeatherState,
  (state) => state.loading
);