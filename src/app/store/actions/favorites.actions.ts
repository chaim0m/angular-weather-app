import {createAction, props} from '@ngrx/store';
import {City} from '../../model/interfaces';

export const addToFavorites = createAction(
  '[Favorites] add to Favorites',
  props<{ data: City }>()
);

export const removeFromFavorites = createAction(
  '[Favorites] Remove From Favorites',
  props<{data: City}>()
);

export const setSelectedFavorite = createAction(
  '[Favorites] Set Selected Favorite',
  props<{ data: City }>()
);
