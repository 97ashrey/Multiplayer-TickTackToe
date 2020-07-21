import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TickTackToeServiceHostResolverService } from './tick-tack-toe-service-host-resolver.service';
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
      const protocol = location.protocol;
      const hostName = location.hostname;
      const portName = location.port;
      return `${protocol}//${hostName}:${portName}/game/${respone.gameId}`;
    }));
  }
}
