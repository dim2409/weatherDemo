import { createReducer, on } from '@ngrx/store';
import { WeatherState } from './weather.state';
import { loadCities, setTempUnit, updateCityName, goToNextPage, goToPrevPage, loadCitiesSuccess } from './weather.actions';

// default state
const initialState: WeatherState = {
    cities: [],
    currentPage: 1,
    pageSize: 4,
    tempUnit: 'si',
    loading: false
};


export const weatherReducer = createReducer(
    initialState,
    on(loadCities, (state, { cities }) => ({
        ...state,
        cities
    })),

    on(setTempUnit, (state, { unit }) => ({
        ...state,
        tempUnit: unit
    })),

    on(goToNextPage, (state) => {
        const totalPages = Math.ceil(state.cities.length / state.pageSize); // math.ceil rounds up upwards to ensure the dibision remainder gets its own page
        return {
            ...state,
            currentPage: Math.min(state.currentPage + 1, totalPages) // returns the min of current page + 1 and total
        };
    }),

    on(goToPrevPage, (state) => ({
        ...state,
        currentPage: Math.max(state.currentPage - 1, 1)
    })),

    on(updateCityName, (state, { cityId, name }) => {
        const cities = state.cities.map(city =>
            city.id === cityId ? { ...city, name } : city
        );
        return { ...state, cities };
    }),

    on(loadCitiesSuccess, (state, { cities }) => ({
        ...state,
        cities
    })),

    on(loadCities, (state) => ({ ...state, loading: true })), // set loading to true when loading cities

    on(loadCitiesSuccess, (state) => ({ ...state, loading: false })), // set loading to false when cities are loaded successfully

);
