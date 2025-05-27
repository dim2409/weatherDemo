export interface CityWeatherPeriod {
    name: string;
    temperature: number;
    unit: string;
    shortForecast: string;
}

export interface City {
    id: string;
    name: string;
    lat: number;
    lon: number;
    periods: CityWeatherPeriod[];
}
