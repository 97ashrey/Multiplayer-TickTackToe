import { Player } from './player';
import { RoundResult } from 'src/app/types/round-result';

export interface MoveResultGameState {
    currentPlayer: Player;
    board: string[],
    roundResult: RoundResult;
    score: any;
    lineThrough: string
}