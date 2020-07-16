import { Component, OnInit } from '@angular/core';
import {WeatherService} from '../../services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(public weatherService: WeatherService){
    // this.getCityForecast('215854');
  }
  days: any;
  isLoaded: boolean;
  celcius: boolean = true;
  getCityForecast(cityKey: string): any{
    this.isLoaded = false
    return this.weatherService.get5DaysForecasts(cityKey, true).subscribe(days => {
      this.days = days.DailyForecasts;
      this.isLoaded = true;
      });
  }

  ngOnInit(): void {
    // this.getCityForecast('215854');
  }

}
