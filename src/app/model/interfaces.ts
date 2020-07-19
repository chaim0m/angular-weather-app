export interface City {
  Key: string;
  LocalizedName: string;
  isFavorite: boolean;
  Country: Country;
  WeatherDesc: string;
  weatherIcon: number;
  Temperature: number;
}

interface Country {
  ID: string;
  LocalizedName: string;
}

export declare type Cities = City[];

export interface WeatherResponse {
  total_count: number;
  incomplete_results: boolean;
  cities: Cities;
}

