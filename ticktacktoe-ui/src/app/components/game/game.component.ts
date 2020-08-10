import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { PlayerStorageService } from 'src/app/services/player-storage.service';
import { PlayerModel } from 'src/app/models/player.model';
import { v1 as uuid } from 'uuid';
import { GamesService } from 'src/app/services/games.service';
import { GameState } from 'src/app/services/game-connection/game-state';
import { GameConnection } from 'src/app/services/game-connection/game-connection';
import { DialogService } from 'src/app/services/dialog.service';
import { RoundResult } from 'src/app/types/round-result';
import { LinePosition } from 'src/app/types/line-position';
import { AlertService } from 'src/app/services/alert.service';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


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
export class GameComponent implements OnInit, OnDestroy {

  @ViewChild('link') linkInput;

  @Input() public gameId: string;
  @Input() public gameUrl: string;
  @Output() gameEnded = new EventEmitter();

  public playerName = '';
  
  public linePositionMap = RoundResultToLinePositionMap;

  public currentClientPlayer: PlayerModel;

  public gameConnection: GameConnection;

  public gameState: GameState;
  
  private subscriptions = new Subscription();

  constructor(
    private playerStorageService: PlayerStorageService,
    private gamesService: GamesService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService) {
      this.dialogAnswerHandler = this.dialogAnswerHandler.bind(this);
    }

  ngOnInit(): void {
    this.processPlayerInfoFromStorage();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.gameConnection.stop();
  }

  public playHandler() {
    if (this.gameConnection && this.gameConnection.connected()) {
      return;
    }

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

    this.gameConnection.doMove(fieldPosition).catch(() => {

      this.alertService.showAlert({
        type: 'danger',
        text: 'Unexpected error occured'
      });

      board[fieldPosition] = "";
    });
  }

  public lineDrawnHandler() {
    this.dialogService.showDialog(
      this.getDialogMessage(this.gameState.roundResult),
      this.dialogAnswerHandler
    );
  }

  copyClickHandler() {
    this.linkInput.nativeElement.select();
    
    document.execCommand('copy');
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

    this.subscriptions.add(
      this.gameConnection.onPlayersConnected().subscribe(gameState => {
        console.log('Players connected');
        console.log(gameState);
 
        this.alertService.showAlert({
          type: 'success',
          text: 'Players connected'
        })

        this.spinner.hide();

        if (this.gameState) {
          return;
        }

        this.gameState = {...gameState};

        if (this.gameState.roundResult !== RoundResult.NotOver) {
          this.dialogService.showDialog(
            this.getDialogMessage(this.gameState.roundResult),
            this.dialogAnswerHandler
          );
        }
      })
    );

    this.subscriptions.add(
      this.gameConnection.onPlayerDisconnected().subscribe(() => {
        console.log('Player disconnected');
        this.alertService.showAlert({
          type: 'warning',
          text: 'Player disconnected'
        })
        this.spinner.show();
      })
    );

    this.subscriptions.add(
      this.gameConnection.onMoveResult().subscribe(moveResult => {
        console.log(moveResult);
  
        this.gameState = {...this.gameState, ...moveResult};
  
        if (this.gameState.roundResult === RoundResult.Draw) {
          this.dialogService.showDialog(
            this.getDialogMessage(this.gameState.roundResult),
            this.dialogAnswerHandler
          );
        }
      })
    );

    this.subscriptions.add(
      this.gameConnection.onNextRound().subscribe(nextRound => {
        console.log(nextRound);
        this.gameState = {...this.gameState, ...nextRound};
      })
    );

    this.subscriptions.add(
      this.gameConnection.onGameOver().subscribe(() => {
        console.log("Game is over");
        this.gameConnection.stop()
          .then(() => {
            this.alertService.showAlert({
              type: 'warning',
              text: 'Game is over'
            });
            this.spinner.hide();
            this.gameEnded.emit();
          })
      })
    );

    this.gameConnection.onClose(() => {
      console.log('Connection closed');
      this.alertService.showAlert({
        type: 'danger',
        text: 'Lost connection'
      })
    });

    this.gameConnection.start()
      .then(() => {
        console.log('Connection started')
        this.alertService.showAlert({
          type: 'success',
          text: 'Connected'
        })
        this.spinner.show();
        this.currentClientPlayer = player;
      })
      .catch(error => {
        console.log(error);
        this.alertService.showAlert({
          type: 'danger',
          text: 'An error occured'
        })
      });
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
    this.gameConnection.voteForRound(answer).then(() => {
      if (!answer) {
        this.gameEnded.emit()
      }
    }).catch(error => console.error('Uncaught error', error));
  }
}
