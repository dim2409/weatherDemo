import { City } from '../models/city.model';

export interface WeatherState {
  cities: City[];
  currentPage: number; // current page
  pageSize: number; // pagination size
  tempUnit: 'us' | 'si';
  loading: boolean;
}
