import {createSelector, createFeatureSelector, } from '@ngrx/store';
import * as fromFavorites from './favorites.reducer';

export interface State {
   state: fromFavorites.FavoritesState;
}

export const selectFavoritesState = createFeatureSelector<fromFavorites.FavoritesState>(fromFavorites.favoritesFeature);
export const getSelectedFavorite = createSelector(selectFavoritesState, fromFavorites.getSelectedFavorite);
export const getFavoritesList = createSelector(selectFavoritesState, fromFavorites.getFavoritesArray)
