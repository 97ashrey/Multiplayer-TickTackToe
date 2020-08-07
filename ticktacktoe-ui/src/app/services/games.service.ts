import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TickTackToeServiceHostResolverService } from './tick-tack-toe-service-host-resolver.service';
import { GameConnection } from './game-connection/game-connection';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const gamesServiceRoutes = {
  newGame: '/api/games/newGame/'
}

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  private hostUrl: string;

  constructor(
    private httpClient: HttpClient, 
    private tickTackToeServiceHostResolver: TickTackToeServiceHostResolverService) {
      this.hostUrl = this.tickTackToeServiceHostResolver.getUrl();
    }

  public newGame(): Observable<string> {
    return this.httpClient.get<{gameId: string}>(`${this.hostUrl}${gamesServiceRoutes.newGame}`)
    .pipe(map(respone => {
      return respone.gameId;
    }));
  }

  public getGameConnection(gameId: string, playerId: string, playerName: string) {
    return new GameConnection(this.hostUrl, gameId, playerId, playerName);
  }
}
