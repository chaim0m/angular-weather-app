import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {FavoritesComponent} from './views/favorites/favorites.component';

const routes: Routes = [
   {path: '', component: HomeComponent},
  {path: 'favorites', component: FavoritesComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
