import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { GameState } from './game-state';
import { MoveResultGameState } from './move-result-game-state';
import { NextRoundGameState } from './next-round-game-state';
import { ChatMessageModel } from '../../models/chat-message.mode';

export class GameConnection {

  private GameEvent = {
    PLAYERS_CONNECTED: 'PlayersConnected',
    PLAYER_DISCONNECTED: 'PlayerDisconnected',
    MOVE_RESULT: 'MoveResult',
    NEXT_ROUND: 'NextRound',
    GAME_OVER: 'GameOver',
    MESSAGE: 'Message'
  }

  private connection: HubConnection;
  private errorHandler: (error: any) => void = (error) => console.error(error);

  constructor(
    private hostUrl: string,
    private gameId: string,
    private playerId: string,
    private playerName: string) {
      this.connection = new HubConnectionBuilder()
      .withUrl(`${this.hostUrl}/game?gameId=${this.gameId}&playerName=${this.playerName}&playerID=${this.playerId}`)
      .build();
    }

  public doMove(fieldPosition: number): void {
    this.connection.invoke('DoMove', fieldPosition)
      .catch(this.errorHandler);
  }

  public voteForRound(vote: boolean): void {
    this.connection.invoke('VoteForRound', vote)
      .catch(this.errorHandler);
  }

  public sendMessage(message: string): void {
    this.connection.invoke('Send', message)
      .catch(this.errorHandler);
  }

  public onPlayersConnected(callback: (gameState: GameState) => void): void {
    this.connection.on(this.GameEvent.PLAYERS_CONNECTED, data => {
      callback(data as GameState);
    });
  }

  public onPlayerDisconnected(callback: () => void): void {
    this.connection.on(this.GameEvent.PLAYER_DISCONNECTED, callback);
  }

  public onMoveResult(callback: (moveResult: MoveResultGameState) => void) {
    this.connection.on(this.GameEvent.MOVE_RESULT, data => {
      callback(data as MoveResultGameState);
    });
  }

  public onNextRound(callback: (nextRound: NextRoundGameState) => void) {
    this.connection.on(this.GameEvent.NEXT_ROUND, data => {
      callback(data as NextRoundGameState);
    });
  }

  public onMessage(callback: (playerId: string, message: string) => void) {
    this.connection.on(this.GameEvent.MESSAGE, (playerId, message) => {
      callback(playerId, message);
    })
  }

  public onGameOver(callback: () => void): void {
    this.connection.on(this.GameEvent.GAME_OVER, callback);
  }

  public onClose(callback: () => void) {
    this.connection.onclose(callback);
  }

  public start(callback?: () => void, error?: (error) => void): void {
    if (error) {
      this.errorHandler = error;
    }
    this.connection.start()
      .then(callback? callback : () => console.log('Connected'))
      .catch(this.errorHandler);
  }

  public close() {
    this.connection.stop();
  }
}
