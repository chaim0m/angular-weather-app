export interface City {
  Key: string;
  LocalizedName: string;
  isFavorite: boolean;
  Country: Country;
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

