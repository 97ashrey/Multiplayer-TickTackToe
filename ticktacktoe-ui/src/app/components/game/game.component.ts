import { Component, OnInit, Input } from '@angular/core';
import { PlayerStorageService } from 'src/app/services/player-storage.service';
import { PlayerModel } from 'src/app/models/player.model';
import { v1 as uuid } from 'uuid';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input() public gameId: string;

  public playerName = '';

  constructor(private playerStorageService: PlayerStorageService) { }

  ngOnInit(): void {
    this.processPlayerInfoFromStorage();
  }

  public playHandler() {
    const player = this.createPlayer();

    if (player === null) {
      return;
    }
    
    this.playerStorageService.setPlayer(player)

    this.connectToGame(player);
  }

  private createPlayer(): PlayerModel {
    if (this.playerName === null || this.playerName === '') {
      return null;
    }

    return {
      id: uuid(),
      name: this.playerName
    };
  }

  private connectToGame (player: PlayerModel): void {
    console.log(player);
    
  }

  private processPlayerInfoFromStorage() : void {
    const player = this.playerStorageService.getPlayer();
    this.playerName = player.name || '';

    if (player.id !== null) {
      this.connectToGame(player);
    }
  }
}
