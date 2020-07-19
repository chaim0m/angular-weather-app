import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, observable, of} from 'rxjs';
import {
  startWith,
  debounceTime,
  switchMap,
  catchError,
  tap
} from 'rxjs/operators';
import {WeatherService} from '../../services/weather.service';
import { Cities, City } from '../../model/interfaces';

@Component({
  selector: 'app-search-autocomplete',
  templateUrl: './search-autocomplete.component.html',
  styleUrls: ['./search-autocomplete.component.css'],
})
export class SearchAutocompleteComponent implements OnInit {

  constructor(public weatherService: WeatherService){ }
  @Output() notify = new EventEmitter<City>();
  public citiesAutoComplete: Observable<Cities> = null;
  public myControl = new FormControl();

  lookup(value: string): Observable<Cities> {
      return this.weatherService.getCities(value.toLowerCase()).pipe(
        // map the item property of the weather results as our return object
        tap(res => console.log(res)),
        // catch errors
        catchError(_ => {
          return of(null);
        })
      );
  }
  displayFn(city: City): string {
    if (city && city.LocalizedName && city.Country && city.Country.LocalizedName){
      return `${city.LocalizedName}, ${city.Country.LocalizedName}`;
    }
    return '';
  }
  citySelected(city: City): void {
    this.notify.emit(city);
  }
  ngOnInit(): void {
    this.citiesAutoComplete = this.myControl.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(300),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '' && typeof value === 'string') {
          // lookup from github
          return this.lookup(value);
        } else {
          // if no value is present, return null
          return of(null);
        }
      })
    );
  }
}
