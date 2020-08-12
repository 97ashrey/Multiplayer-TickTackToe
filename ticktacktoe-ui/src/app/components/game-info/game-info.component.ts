import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { Player } from 'src/app/services/game-connection/player';
import { PlayersConnectionService } from 'src/app/services/players-connection.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface PlayerWithScore {
  id: string;
  name: string;
  move: string;
  connected: boolean;
  score: number;
}

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit, OnDestroy {

  @Input() currentPlayerId: string;
  @Input() score: any;
  @Input() round: number;

  public thisClientPlayer: PlayerWithScore;
  public otherClientPlayer: PlayerWithScore;

  private subscriptions = new Subscription();

  constructor(private playersConnectionService: PlayersConnectionService) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.playersConnectionService.getThisClientPlayer()
      .subscribe(player => {
        const score = this.score[player.id];
        this.thisClientPlayer = {...player, score};
      })
    );

    this.subscriptions.add(
      this.playersConnectionService.getOtherClientPlayer()
      .subscribe(player => {
        const score = this.score[player.id];
        this.otherClientPlayer = {...player, score};
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
