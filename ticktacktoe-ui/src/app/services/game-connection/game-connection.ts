import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { GameState } from './game-state';
import { MoveResultGameState } from './move-result-game-state';
import { NextRoundGameState } from './next-round-game-state';
import { ChatMessage } from './chat-message';
import { Observable, Subscriber } from 'rxjs';

export class GameConnection {

  private GameEvents = {
    PLAYERS_CONNECTED: 'PlayersConnected',
    PLAYER_DISCONNECTED: 'PlayerDisconnected',
    MOVE_RESULT: 'MoveResult',
    NEXT_ROUND: 'NextRound',
    GAME_OVER: 'GameOver',
    MESSAGE: 'Message'
  }

  private GameActions = {
    DO_MOVE: 'DoMove',
    VOTE_FOR_ROUND: 'VoteForRound',
    SEND: 'Send'
  }

  private connection: HubConnection;

  constructor(
    private hostUrl: string,
    private gameId: string,
    private playerId: string,
    private playerName: string) {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${this.hostUrl}/game?gameId=${this.gameId}&playerName=${this.playerName}&playerID=${this.playerId}`)
      .build();
  }

  public doMove(fieldPosition: number): Promise<any> {
    return this.connection.invoke(this.GameActions.DO_MOVE, fieldPosition)
  }

  public voteForRound(vote: boolean): Promise<any> {
    return this.connection.invoke(this.GameActions.VOTE_FOR_ROUND, vote);
  }

  public sendMessage(message: string): Promise<any> {
    return this.connection.invoke(this.GameActions.SEND, message);
  }

  public onPlayersConnected(): Observable<GameState> {
    return this.fromSignalREvent(this.GameEvents.PLAYERS_CONNECTED, (subscriber) =>
      (data) => subscriber.next(data as GameState)
    );
  }

  public onPlayerDisconnected(): Observable<void> {
    return this.fromSignalREvent(this.GameEvents.PLAYER_DISCONNECTED, (subscriber) =>
      () => subscriber.next()
    );
  }

  public onMoveResult(): Observable<MoveResultGameState> {
    return this.fromSignalREvent(this.GameEvents.MOVE_RESULT, (subscriber) =>
      (data) => subscriber.next(data as MoveResultGameState)
    );
  }

  public onNextRound(): Observable<NextRoundGameState> {
    return this.fromSignalREvent(this.GameEvents.NEXT_ROUND, (subscriber) =>
      (data) => subscriber.next(data as NextRoundGameState)
    );
  }

  public onMessage(): Observable<ChatMessage> {
    return this.fromSignalREvent(this.GameEvents.MESSAGE, (subscriber) =>
      (data) => subscriber.next(data as ChatMessage)
    );
  }

  public onGameOver(): Observable<void> {
    return this.fromSignalREvent(this.GameEvents.GAME_OVER, (subsrcirber) =>
      () => subsrcirber.next());
  }

  public onClose(callback: (error?: Error) => void) {
    this.connection.onclose(callback);
  }

  public start(): Promise<any> {
    return this.connection.start();
  }

  public stop(): Promise<any> {
    return this.connection.stop();
  }

  private fromSignalREvent<T>(gameEvent: string, evtHandlerBuilder: (subscriber: Subscriber<any>) => (...args: any[]) => void): Observable<T> {
    return new Observable(subscriber => {

      try {
        const evtHandler = evtHandlerBuilder(subscriber);

        this.connection.on(gameEvent, evtHandler);

        return () => this.connection.off(gameEvent, evtHandler);
      } catch (err) {
        subscriber.error(err);
      }

    });
  }

}
