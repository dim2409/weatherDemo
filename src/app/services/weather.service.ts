// src/app/services/weather.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, mergeMap } from 'rxjs';
import { AppSettings } from '../app.settings';

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
        mergeMap(pointsResponse => {
          const baseForecastPath = pointsResponse.properties?.forecast; // forecast path

          const mockForecastUrl = `${baseForecastPath.replace('.json', '')}-${unit}.json`; // adjust based on selected unit

          return this.http.get<any>(mockForecastUrl);
        }),
        map(forecastResponse => forecastResponse.properties?.periods ?? [])
      );
    } else {
      //real api
      const url = `https://api.weather.gov/points/${lat},${lon}`;
      return this.http.get<any>(url).pipe(
        mergeMap(res => {
          const forecastUrl = res.properties?.forecast;
          return this.http.get<any>(forecastUrl + (unit === 'si' ? '?units=si' : ''));
        }),
        map(res => res.properties?.periods ?? [])
      );
    }
  }
}