import { Player } from './player';

export interface MoveResultGameState {
    currentPlayer: Player;
    board: string[],
    roundOver: boolean;
    score: any;
    lineThrough: string
}