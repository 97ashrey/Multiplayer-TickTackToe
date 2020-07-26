import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Player } from 'src/app/services/game-connection/player';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit, OnChanges {

  @Input() players: Player[];
  @Input() currentPlayer: Player;
  @Input() score: any;
  @Input() round: number;
  @Input() thisClientPlayerId: string;

  public thisClientPlayer: Player;
  public otherClientPlayer: Player;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.players.forEach(player => {
      if (player.id === this.thisClientPlayerId) {
        this.thisClientPlayer = player;
      } else {
        this.otherClientPlayer = player;
      }
    });
  }

}
