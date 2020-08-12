import { Injectable } from '@angular/core';
import { Player } from './game-connection/player';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayersConnectionService {

  private thisClientPlayerSource = new BehaviorSubject<Player>(null);
  private otherClientPlayerSource = new BehaviorSubject<Player>(null);

  public thisClientPlayer$ = this.thisClientPlayerSource.asObservable();
  public otherClientPlayer$ = this.otherClientPlayerSource.asObservable();

  private thisClientPlayerId: string;

  constructor() { }

  public setCurrentPlayerId(thisClientPlayerId: string): void {
    this.thisClientPlayerId = thisClientPlayerId;
    console.log(this.thisClientPlayerId);
  }

  public updatePlayers(...players: Player[]): void {
    players.forEach(player => {
      if (player.id === this.thisClientPlayerId) {
        this.updateSubject(this.thisClientPlayerSource, player);
      }
      else {
        this.updateSubject(this.otherClientPlayerSource, player);
      }
    });
  }

  private areEqual(x: Player, y: Player) {
    if (x && y) {
      let equal = true;

      Object.keys(x).forEach(key => {
        equal = equal && x[key] === y[key];
      })

      return equal;
    }

    return false;
  }

  private updateSubject(subject: BehaviorSubject<Player>, value: Player): void {
    if (!this.areEqual(subject.getValue(), value)) {
      subject.next(value);
    }
  }
}
