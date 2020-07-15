import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Material } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { SearchAutocompleteComponent } from './components/search-autocomplete/search-autocomplete.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {TopNavComponent} from './components/top-nav/top-nav.component';
import {FavoritesComponent} from './views/favorites/favorites.component';
import {HomeComponent} from './views/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchAutocompleteComponent,
    TopNavComponent,
    HomeComponent,
    FavoritesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Material,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({}, {})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
