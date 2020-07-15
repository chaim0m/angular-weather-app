import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {Cities} from '../model/interfaces';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private url = 'https://dataservice.accuweather.com/';
  private APIKey = 'MtoQd62TAl5buckrt5EXkWw46h76WdNq';

  constructor(private httpClient: HttpClient) { }

  // Get City key By Geo-Position from API
  public getCitiesByGeoPosition(lat: string, long: string): Observable<any> {

    const getCitiesURL = `${this.url}locations/v1/cities/geoposition/search?apikey=${this.APIKey}&q=${lat},${long}`;

    return this.httpClient.get(getCitiesURL)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get Cities by search text from API
  public getCities(searchText: string): Observable<Cities> {

    const getCitiesURL = `${this.url}locations/v1/cities/autocomplete?apikey=${this.APIKey}&q=${searchText}`;

    return this.httpClient.get<Cities>(getCitiesURL)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get current weather from API
  public getCurrentCondition(locationKey: string): Observable<any> {

    const getCurrentConditionURL = `${this.url}currentconditions/v1/${locationKey}?apikey=${this.APIKey}`;

    return this.httpClient.get(getCurrentConditionURL)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get 5 day daily forecast from API
  public get5DaysForecasts(locationKey: string, metric: boolean = true): Observable<any> {

    const get5DaysForecastsURL = `${this.url}forecasts/v1/daily/5day/${locationKey}?apikey=${this.APIKey}&metric=${metric}`;

    return this.httpClient.get(get5DaysForecastsURL)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Handle Errors - global function
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something bad happened, please try again later.');
  }

}
