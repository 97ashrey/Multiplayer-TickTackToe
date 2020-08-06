import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule }   from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { GameComponent } from './components/game/game.component';
import { GameInfoComponent } from './components/game-info/game-info.component';
import { BoardComponent } from './components/board/board.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AlertComponent } from './components/alert/alert.component';
import { AlertContainerComponent } from './components/alert-container/alert-container.component';
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    GamePageComponent,
    GameComponent,
    GameInfoComponent,
    BoardComponent,
    ConfirmDialogComponent,
    AlertComponent,
    AlertContainerComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
