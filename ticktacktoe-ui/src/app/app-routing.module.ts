import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router

import { HomePageComponent } from './pages/home-page/home-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';

// sets up routes constant where you define your routes
const routes: Routes = [
    { path: 'home', component: HomePageComponent },
    { path: '', component: HomePageComponent },
    { path: 'games/:gameId', component: GamePageComponent }
]; 

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }