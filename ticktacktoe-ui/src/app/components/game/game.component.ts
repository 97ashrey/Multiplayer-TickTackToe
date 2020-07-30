import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerStorageService } from 'src/app/services/player-storage.service';
import { PlayerModel } from 'src/app/models/player.model';
import { v1 as uuid } from 'uuid';
import { GamesService } from 'src/app/services/games.service';
import { GameState } from 'src/app/services/game-connection/game-state';
import { GameConnection } from 'src/app/services/game-connection/game-connection';
import { DialogService } from 'src/app/services/dialog.service';
import { RoundResult } from 'src/app/types/round-result';
import { LinePosition } from 'src/app/types/line-position';


const RoundResultToLinePositionMap = new Map<RoundResult, LinePosition>();
RoundResultToLinePositionMap.set(RoundResult.TopRow, 'row-1');
RoundResultToLinePositionMap.set(RoundResult.MiddleRow, 'row-2');
RoundResultToLinePositionMap.set(RoundResult.BottomROw, 'row-3');
RoundResultToLinePositionMap.set(RoundResult.LeftColumn, 'col-1');
RoundResultToLinePositionMap.set(RoundResult.MiddleColumn, 'col-2');
RoundResultToLinePositionMap.set(RoundResult.RightColumn, 'col-3');
RoundResultToLinePositionMap.set(RoundResult.Diagonal, 'diag');
RoundResultToLinePositionMap.set(RoundResult.InverseDiagonal, 'inv-diag');

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input() public gameId: string;
  @Output() gameEnded = new EventEmitter();

  public playerName = '';
  
  public linePositionMap = RoundResultToLinePositionMap;

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
    private dialogService: DialogService) {
      this.dialogAnswerHandler = this.dialogAnswerHandler.bind(this);
    }

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
    this.dialogService.showDialog(
      this.getDialogMessage(this.gameState.roundResult),
      this.dialogAnswerHandler
    );
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


      if (this.gameState.roundResult !== RoundResult.NotOver) {
        this.dialogService.showDialog(
          this.getDialogMessage(this.gameState.roundResult),
          this.dialogAnswerHandler
        );
      }
    });

    this.gameConnection.onPlayerDisconnected(() => {
      console.log('Player disconnected');
    });

    this.gameConnection.onMoveResult(moveResult => {
      console.log(moveResult);

      this.gameState = {...this.gameState, ...moveResult};

      if (this.gameState.roundResult === RoundResult.Draw) {
        this.dialogService.showDialog(
          this.getDialogMessage(this.gameState.roundResult),
          this.dialogAnswerHandler
        );
      }
    })

    this.gameConnection.onNextRound(nextRound => {
      console.log(nextRound);
      this.gameState = {...this.gameState, ...nextRound};
    })

    this.gameConnection.onGameOver(() => {
      console.log("Game is over");
      this.gameConnection.close();
      this.gameEnded.emit();
    });

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

  private getDialogMessage(roundResult: RoundResult): string {
    if (roundResult === RoundResult.Draw) {
      return "It's a draw. Play next round?";
    } else if (roundResult !== RoundResult.NotOver) {
      return `Player ${this.gameState.currentPlayer.move} won. Play next round?`
    }
  }

  private dialogAnswerHandler(answer: boolean): void {
    this.gameConnection.voteForRound(answer);
    if (!answer) {
      this.gameEnded.emit();
    }
  }
}
