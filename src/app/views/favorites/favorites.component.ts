import { Component, OnInit } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {FavoritesState} from '../../store/reducers/favorites.reducer';
import {City} from '../../model/interfaces';
import { map } from 'rxjs/operators';
import {WeatherService} from '../../services/weather.service';
import {UtilsService} from '../../services/utils.service';
import {select, Store} from '@ngrx/store';
import * as favoritesActions from '../../store/actions/favorites.actions';
import {Router} from '@angular/router';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  constructor(public weatherService: WeatherService, private router: Router, private store: Store<{favorites: FavoritesState}>) {
    this.favorites$ = store.pipe(select('favorites'));
  }
  favorites$: Observable<FavoritesState>;
  FavoritesSubscription: Subscription;
  FavoritesList: City[] = [];

   onFavoriteClick(favorite: City): void{
      const copy = JSON.parse(JSON.stringify(favorite))
      this.store.dispatch(favoritesActions.setSelectedFavorite({data: copy}));
      this.router.navigateByUrl('/').then();
  }
  ngOnInit(): void {
    this.FavoritesSubscription = this.favorites$
      .pipe(
        map(x => {
          this.FavoritesList = x.favoritesArray;
        })
      )
      .subscribe();
  }

}
