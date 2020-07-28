import { Component, OnInit, Input } from '@angular/core';
import { PlayerStorageService } from 'src/app/services/player-storage.service';
import { PlayerModel } from 'src/app/models/player.model';
import { v1 as uuid } from 'uuid';
import { GamesService } from 'src/app/services/games.service';
import { GameState } from 'src/app/services/game-connection/game-state';
import { GameConnection } from 'src/app/services/game-connection/game-connection';
import { DialogService } from 'src/app/services/dialog.service';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input() public gameId: string;

  public playerName = '';

  public currentClientPlayer: PlayerModel
  //  = {
  //   id: '1',
  //   name: 'Player1'
  // };

  private gameConnection: GameConnection;

  public gameState: GameState
  //  = {
  //   id: '123',
  //   players: [
  //     {id: '1', name: 'Player1', move: 'X'},
  //     {id: '2', name: 'Player2', move: 'O'}
  //   ],
  //   currentPlayer: {id: '1', name: 'Player1', move: 'X'},
  //   board: ["X","X","X","X","X","X","","O","O"],
  //   round: 1,
  //   roundOver: true,
  //   score: {
  //     Player1: 1,
  //     Player2: 2
  //   },
  //   lineThrough: 'row-1'
  // };

  constructor(
    private playerStorageService: PlayerStorageService,
    private gamesService: GamesService,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.processPlayerInfoFromStorage();
  }

  public playHandler() {
    const player = this.createPlayer();

    if (player === null) {
      return;
    }

    this.playerStorageService.setPlayer(this.gameId, player);
    this.connectToGame(player);
  }

  public fieldClickHandler(fieldPosition: number): void {
    console.log(fieldPosition);
    if (this.currentClientPlayer.id !== this.gameState.currentPlayer.id) {
      return;
    }

    const board = this.gameState.board;

    if (board[fieldPosition] !== "") {
      return;
    }

    board[fieldPosition] = this.gameState.currentPlayer.move;

    this.gameConnection.doMove(fieldPosition);
  }

  public lineDrawnHandler() {
    if (this.gameState.roundOver) {
      this.dialogService.showDialog(
        "Play next round",
        answer => {
          this.gameConnection.voteForRound(answer);
        }
      )
    }
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
    })

    this.gameConnection.onNextRound(nextRound => {
      console.log(nextRound);
      this.gameState = {...this.gameState, ...nextRound};
      this.gameState.lineThrough = null;
    })

    this.gameConnection.onClose(() => {
      console.log('Connection closed');
    });

    this.gameConnection.start(
      () => {
        console.log('Connection started')
        this.currentClientPlayer = player;
      },
      error => console.log('Error Occured', error)
    );
  }

  private processPlayerInfoFromStorage() : void {
    const player = this.playerStorageService.getPlayer(this.gameId);
    this.playerName = player.name || '';

    if (player.id !== null) {
      this.connectToGame(player);
    }
  }

}
