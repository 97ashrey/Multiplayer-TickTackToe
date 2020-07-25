import { Component, OnInit, Input } from '@angular/core';
import { PlayerStorageService } from 'src/app/services/player-storage.service';
import { PlayerModel } from 'src/app/models/player.model';
import { v1 as uuid } from 'uuid';
import { GamesService } from 'src/app/services/games.service';
import { GameState } from 'src/app/services/game-connection/game-state';
import { GameConnection } from 'src/app/services/game-connection/game-connection';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input() public gameId: string;

  public playerName = '';

  private gameConnection: GameConnection;

  public gameState: GameState;

  constructor(
    private playerStorageService: PlayerStorageService,
    private gamesService: GamesService) { }

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
    this.gameConnection = this.gamesService.getGameConnection(this.gameId, player.id, player.name);

    this.gameConnection.onPlayersConnected(gameState => {
      console.log('Players connected');
      console.log(gameState);
      this.gameState = {...gameState};

      if (this.gameState.roundOver) {
        const vote = confirm("Play next round");
        this.gameConnection.voteForRound(vote);
      }
    });

    this.gameConnection.onPlayerDisconnected(() => {
      console.log('Player disconnected');
    });

    this.gameConnection.onMoveResult(moveResult => {
      console.log(moveResult);

      this.gameState = {...this.gameState, ...moveResult};
      if (moveResult.roundOver) {
        const vote = confirm("Play next round");
        this.gameConnection.voteForRound(vote);
      }
    })

    this.gameConnection.onNextRound(nextRound => {
      console.log(nextRound);
      this.gameState = {...this.gameState, ...nextRound};
    })

    this.gameConnection.onClose(() => {
      console.log('Connection closed');
    });

    this.gameConnection.start(
      () => console.log('Connection started'),
      error => console.log('Error Occured', error)
    );
  }

  private processPlayerInfoFromStorage() : void {
    const player = this.playerStorageService.getPlayer();
    this.playerName = player.name || '';

    if (player.id !== null) {
      this.connectToGame(player);
    }
  }

  public fieldClickHandler(fieldPosition: number): void {
    this.gameConnection.doMove(fieldPosition);
  }
}
