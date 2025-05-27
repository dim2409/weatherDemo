// src/app/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, map, delay } from 'rxjs';
import { AppSettings } from '../app.settings';
import { } from '../../assets/mock/mock-points.json';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) { }

  getForecastForCoords(lat: number, lon: number, unit: 'us' | 'si' = 'si'): Observable<any> {
    if (AppSettings.mockServer) {
      //mock
      const mockPointsUrl = '../../assets/mock/mock-points.json';
      
      return this.http.get<any>(mockPointsUrl).pipe(
        switchMap(pointsResponse => {
          const baseForecastPath = pointsResponse.properties?.forecast; // forecast path

          const mockForecastUrl = `${baseForecastPath.replace('.json', '')}-${unit}.json`; // adjust based on selected unit
          
          return this.http.get<any>(mockForecastUrl).pipe();
        }),
        map(forecastResponse => forecastResponse.properties?.periods ?? [])
      );
    } else {
      //real api
      console.log(`%cUsing LIVE API for ${lat},${lon} with unit: ${unit}`, "background: lightblue; color: black; padding: 2px 5px;");
      const url = `https://api.weather.gov/points/${lat},${lon}`;
      return this.http.get<any>(url).pipe(
        switchMap(res => {
          const forecastUrl = res.properties?.forecast;
          if (!forecastUrl) throw new Error('No forecast URL found for this location');
          return this.http.get<any>(forecastUrl + (unit === 'si' ? '?units=si' : ''));
        }),
        map(res => res.properties?.periods ?? [])
      );
    }
  }
}