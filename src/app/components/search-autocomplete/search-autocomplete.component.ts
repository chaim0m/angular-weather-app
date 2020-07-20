import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {NG_VALIDATORS, Validator, AbstractControl, ValidatorFn, FormControl} from '@angular/forms';
import {Observable, observable, of} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

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

  constructor(private snackBar: MatSnackBar, public weatherService: WeatherService){
    this.myControl.setValidators(this.allowedChars());
  }
  @Output() notify = new EventEmitter<City>();
  public citiesAutoComplete: Observable<Cities> = null;
  public myControl = new FormControl()
  allowedChars(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null  => {
      const valid = new RegExp(/^[a-zA-Z, ]+$/).test(control.value)
      if (!valid){
        return {'englishOnly': { value: control.value }};
      }
      return null;
    };
  }

  lookup(value: string): Observable<Cities> {
      return this.weatherService.getCities(value.toLowerCase()).pipe(
        // catch errors
        catchError((err, caught) => {
          this.openSnackBar(`An Error occured in the auto complete search: ${err}`);
          if (caught){
            return;
          }
          return caught;
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
  openSnackBar(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 3000,
    });
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
