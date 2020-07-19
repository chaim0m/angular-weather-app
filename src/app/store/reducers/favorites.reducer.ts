import {Action, createReducer, on} from '@ngrx/store';
import * as favoritesActions from '../actions/favorites.actions';
import {City} from '../../model/interfaces';

export class FavoritesState {
  favoritesArray: City[];
  selectedFavorite: City;
}

export const initialState: FavoritesState = {
  favoritesArray: [],
  selectedFavorite: null
};

export const favoritesFeature = 'favorites';

export const reducer = createReducer(
  initialState,
  on(favoritesActions.removeFromFavorites,
    (state, {data}) => ({...state, favoritesArray: [...state.favoritesArray.filter(fav => fav.Key !== data.Key)]})
  ),
  on(favoritesActions.addToFavorites,
    (state, {data}) => ({...state, favoritesArray: [...state.favoritesArray, data]})
  ),
  on(favoritesActions.setSelectedFavorite,
    (state, {data}) => ({...state, selectedFavorite: data}))
);


export const getFavoritesArray = (state: FavoritesState) => state.favoritesArray;
export const getSelectedFavorite = (state: FavoritesState) => state.selectedFavorite;


export function favoritesReducer(state = initialState, action: Action) {
  return reducer(state, action);
}
