import { Routes } from '@angular/router';
import { WeatherListComponent } from './components/weather-list/weather-list.component';
import { SuggestionFormComponent } from './components/suggestion-form/suggestion-form.component';

export const routes: Routes = [
    { path: '', component: WeatherListComponent },
    { path: 'suggest/:cityId', component: SuggestionFormComponent },
    { path: '**', redirectTo: '' }
];
