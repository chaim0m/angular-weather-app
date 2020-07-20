import { Component, OnInit, AfterContentInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, take} from 'rxjs/operators';
import {WeatherService} from '../../services/weather.service';
import { City } from '../../model/interfaces';
import { defaultCity } from '../../model/defaults';
import {UtilsService} from '../../services/utils.service';
import {Store, select} from '@ngrx/store';
import * as favoritesActions from '../../store/actions/favorites.actions';
import { FavoritesState } from '../../store/reducers/favorites.reducer';
import * as fromRoot from '../../store/reducers';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private snackBar: MatSnackBar, public weatherService: WeatherService, public utilsService: UtilsService, private store: Store<{ favorites: FavoritesState }>) { }

  days: any;
  isLoaded: boolean;
  isCelsius: boolean = true;
  public currentCity: City;
  FavoritesList: City[] = [];

  getCityForecast(city: City): any {
    this.currentCity = city
    this.isLoaded = false
    this.weatherService.get5DaysForecasts(city.Key, true).pipe(
      catchError(val => val.subscribe(errMsg => this.openSnackBar(errMsg)))
    )
      .subscribe(days => {
        this.days = days.DailyForecasts;
        this.isLoaded = true;
      });
    this.weatherService.getCurrentCondition(city.Key).subscribe(cityData => {
      const [cityInfo] = cityData
      this.currentCity.WeatherDesc = cityInfo.WeatherText;
      this.currentCity.Temperature = cityInfo.Temperature.Metric.Value;
      this.currentCity.weatherIcon = cityInfo.WeatherIcon;
      this.FavoritesList.map(favorite => {
        if (favorite.Key === this.currentCity.Key) {
          this.currentCity.isFavorite = true;
        }
      });
    });
  }

  searchCityByGeoPosition(lat, long): void {

    this.weatherService.getCitiesByGeoPosition(lat, long)
      .subscribe(
        (data: any) => {
          this.currentCity = data;
          this.getCityForecast(this.currentCity);
        },
        (error) => {
          console.error(error);
          this.openSnackBar(`error ${error}`);
        }
      );
  }


  convertUnitType(): void {
    if (this.currentCity && this.days) {
      if (this.isCelsius) {
        this.currentCity.Temperature = this.utilsService.cToF(this.currentCity.Temperature);
        this.days.forEach(day => {
          day.Temperature.Maximum.Value = this.utilsService.cToF(day.Temperature.Maximum.Value);
          day.Temperature.Minimum.Value = this.utilsService.cToF(day.Temperature.Minimum.Value);
        });
        this.isCelsius = !this.isCelsius;
      } else {
        this.currentCity.Temperature = this.utilsService.fToC(this.currentCity.Temperature);
        this.days.forEach(day => {
          day.Temperature.Maximum.Value = this.utilsService.fToC(day.Temperature.Maximum.Value);
          day.Temperature.Minimum.Value = this.utilsService.fToC(day.Temperature.Minimum.Value);
        });
        this.isCelsius = !this.isCelsius;
      }
    }
  }

  onToggleFavoriteClick(): void {
    const payload: City = {
      Key: this.currentCity.Key,
      LocalizedName: this.currentCity.LocalizedName,
      Country: this.currentCity.Country,
      WeatherDesc: this.currentCity.WeatherDesc,
      weatherIcon: this.currentCity.weatherIcon,
      Temperature: this.currentCity.Temperature,
      isFavorite: this.currentCity.isFavorite,
    }
    if (this.currentCity.isFavorite) {
      this.currentCity.isFavorite = payload.isFavorite = false
      this.store.dispatch(favoritesActions.removeFromFavorites({data: payload}));
      console.log(this.FavoritesList);
    } else {
      this.currentCity.isFavorite = payload.isFavorite = true
      this.store.dispatch(favoritesActions.addToFavorites({data: payload}));
      console.log(this.FavoritesList);
    }
  }

  openSnackBar(error: string): void {
    this.snackBar.open(error, 'Close', {
      duration: 3000,
    });
  }

  ngOnInit(): void {
    this.store.select(fromRoot.getFavoritesList).pipe((take(1))).subscribe((favorites) => {
      if (favorites && favorites.length > 0) {
        this.FavoritesList = [...favorites];
        this.store.select(fromRoot.getSelectedFavorite).pipe(take(1)).subscribe((selectedCity) => {
          if (!selectedCity) {
            if (!navigator.geolocation && !this.currentCity) {
              this.getCityForecast(defaultCity);
            } else if (navigator.geolocation && !this.currentCity) {
              navigator.geolocation.getCurrentPosition(
                (data: any) => {
                  this.searchCityByGeoPosition(data.coords.latitude, data.coords.longitude);
                });
            }
          } else {
            this.getCityForecast({...selectedCity});
          }
        });
      } else {
        if (!this.currentCity){
          let currentPos
          navigator.geolocation.getCurrentPosition((data: any) => currentPos  = data);
          navigator.permissions.query({name: 'geolocation'}).then(({state}) => {
            if (state === 'denied' || !currentPos) {
              if (!this.currentCity) {
                this.getCityForecast(defaultCity);
              }
            } else {
              this.searchCityByGeoPosition(currentPos.coords.latitude, currentPos.coords.longitude);
            }
          });
        }
        }
      });
  }
}
